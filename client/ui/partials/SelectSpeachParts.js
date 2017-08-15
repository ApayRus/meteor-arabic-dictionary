Template.SelectSpeachParts.onCreated(function(){
    this.showMiddleHarakat = new ReactiveVar( false );
    if (this.data.speachPart == 'глагол, I порода') {
        this.showMiddleHarakat.set( true );
    }
    else {
        this.showMiddleHarakat.set( false );
    }       
});

Template.SelectSpeachParts.helpers({
    speachParts: function() {
        const speachParts = [
            {
                optgroup: "имя",
                options: [
                {label: "Существительное", value: "Существительное"},
                {label: "Прилагательное", value: "Прилагательное"},
                {label: "Наречие", value: "Наречие"}
                ]
            },
            {
                optgroup: "глагол",
                options: [
                {label: "порода I", value: "глагол, I порода"},
                {label: "порода II", value: "глагол, II порода"},
                {label: "порода III", value: "глагол, III порода"},
                {label: "порода IV", value: "глагол, IV порода"},
                {label: "порода V", value: "глагол, V порода"},
                {label: "порода VI", value: "глагол, VI порода"},
                {label: "порода VII", value: "глагол, VII порода"},
                {label: "порода VIII", value: "глагол, VIII порода"},
                {label: "порода IX", value: "глагол, IX порода"},
                {label: "порода X", value: "глагол, X порода"},                             
                ]
            },
            {
                optgroup: "частица",
                options: [
                {label: "частица родительного падежа", value: "частица родительного падежа"},
                {label: "частица винительного падежа", value: "частица винительного подежа"},
                ]
            }
            ];
        return speachParts
    },
    showMiddleHarakat: function(value){

        return Template.instance().showMiddleHarakat.get();
    }, 
    isSelected : function (value) {
      if (value == this.speachPart){
        
        return "selected"
      }
      else {
        return ''
      }
    }
}); 


Template.SelectSpeachParts.events({
    "change .speachPart": function (event, template) {
        selectedSpeachPart = event.target.options[event.target.selectedIndex].value; 
        if(selectedSpeachPart == "глагол, I порода") {
            template.showMiddleHarakat.set(true)
        }
        else {
            template.showMiddleHarakat.set(false)
        }
    }
});