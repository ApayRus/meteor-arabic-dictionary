import { Mongo } from 'meteor/mongo';

export const Words = new Mongo.Collection('words'); 
// с большой буквы у нас и с маленькой буквы в монге