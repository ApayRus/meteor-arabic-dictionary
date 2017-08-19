/*import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const Images = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true, // Disallow remove files from Client
  onBeforeUpload(file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1048576 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    } else {
      return 'Please upload image, with size equal or less than 1MB';
    }
  }
});

if (Meteor.isClient) {
  Meteor.subscribe('files.images.all');
}

if (Meteor.isServer) {
  Meteor.publish('files.images.all', function () {
    return Images.find().cursor;
  });
}*/

import { Meteor } from "meteor/meteor";
import { FilesCollection } from "meteor/ostrio:files";

import { _ } from "meteor/underscore";
import { Random } from "meteor/random";

import fs from "fs";
import stream from "stream";

var s3, bound, s3Conf = {};

if (Meteor.isServer) {

    import S3 from "aws-sdk/clients/s3";

    s3Conf = Meteor.settings.s3 || {};
    bound = Meteor.bindEnvironment((callback) => {
        return callback();
    });

    // Create a new S3 object
    s3 = new S3({
        secretAccessKey: s3Conf.secret,
        accessKeyId: s3Conf.key,
        region: s3Conf.region,
        sslEnabled: true,
        httpOptions: {
            timeout: 6000,
            agent: false
        }
    });
}

var Images = new FilesCollection({
    debug: false,
    collectionName: "Images",
    allowClientCode: true, // Disallow remove files from Client
    onBeforeUpload(file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 1048576 && /png|jpg|jpeg|gif|svg/i.test(file.extension)) {
            return true;
        } else {
            return 'Please upload image, with size equal or less than 1MB';
        }
    },
    onAfterUpload(fileRef) {
        var self = this;
        _.each(fileRef.versions, (vRef, version) => {
            const filePath = "files/" + (Random.id()) + "-" + version + "." + fileRef.extension;
            s3.putObject({
                ServerSideEncryption: "AES256",
                StorageClass: "STANDARD",
                Bucket: s3Conf.bucket,
                Key: filePath,
                Body: fs.createReadStream(vRef.path),
                ContentType: vRef.type,
            }, (error) => {
                bound(() => {
                    if (error) {
                        console.error(error);
                    } else {

                        const upd = { $set: {} };
                        upd["$set"]["versions." + version + ".meta.pipePath"] = filePath;

                        self.collection.update({
                            _id: fileRef._id
                        }, upd, function(updError) {
                            if (updError) {
                                console.error(updError);
                            } else {
                                console.log("Uploaded to S3");
                                self.unlink(self.collection.findOne(fileRef._id), version);
                            }
                        });
                    }
                });
            });
        });
    },
    interceptDownload(http, fileRef, version) {
        let path;

        if (fileRef && fileRef.versions && fileRef.versions[version] && fileRef.versions[version].meta && fileRef.versions[version].meta.pipePath) {
            path = fileRef.versions[version].meta.pipePath;
        }

        if (path) {
      
            const opts = {
                Bucket: s3Conf.bucket,
                Key: path
            };

            if (http.request.headers.range) {
                const vRef = fileRef.versions[version];
                let range = _.clone(http.request.headers.range);
                const array = range.split(/bytes=([0-9]*)-([0-9]*)/);
                const start = parseInt(array[1]);
                let end = parseInt(array[2]);
                if (isNaN(end)) {
                    // Request data from AWS:S3 by small chunks
                    end = (start + this.chunkSize) - 1;
                    if (end >= vRef.size) {
                        end = vRef.size - 1;
                    }
                }
                opts.Range = `bytes=${start}-${end}`;
                http.request.headers.range = `bytes=${start}-${end}`;
            }

            const fileColl = this;
            s3.getObject(opts, function(error) {
                if (error) {
                    console.error(error);
                    if (!http.response.finished) {
                        http.response.end();
                    }
                } else {

                    if (http.request.headers.range && this.httpResponse.headers["content-range"]) {
                        // Set proper range header in according to what is returned from AWS:S3
                        http.request.headers.range = this.httpResponse.headers["content-range"].split("/")[0].replace("bytes ", "bytes=");
                    }

                    const dataStream = new stream.PassThrough();
                    fileColl.serve(http, fileRef, fileRef.versions[version], version, dataStream);
                    dataStream.end(this.data.Body);
                }
            });

            return true;
        }
       
        return false;
    }
});

global.Images = Images;

if (Meteor.isServer) {

    Meteor.publish("files.images.all", function() {
        return Images.find().cursor;
    });

} else {
    Meteor.subscribe("files.images.all");
}

export default Images;