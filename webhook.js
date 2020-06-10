/* exported Script */
/* globals console, _, s */

/** Global Helpers
 *
 * console - A normal console instance
 * _       - An underscore instance
 * s       - An underscore string instance
 */

// Updated By Ramon Joaquim

//function blatantly stolen
function dateDiff(datepart, fromdate, todate) {	
  datepart = datepart.toLowerCase();	
  var diff = todate - fromdate;	
  var divideBy = { w:604800000, 
                   d:86400000, 
                   h:3600000, 
                   n:60000, 
                   s:1000 };	
  
  return Math.floor( diff/divideBy[datepart]);
}

//function blatantly stolen and modified
function getFormattedDate(d, offset){
    // convert to msec
    // add local time zone offset
    // get UTC time in msec
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);

    // create new Date object for different city
    // using supplied offset
    var nd = new Date(utc + (3600000*offset));

  	dstr = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + nd.toLocaleTimeString();
  	
    return dstr;
}

function getFormattedDatePtBr(d, fullDate){

    var fulldt = fullDate.split("T")[1];
    var fulldt2 = fulldt.split("-")[0];

    dstr = ('0' + d.getDate()).slice(-2) + " "+ d.toLocaleString('pt', { month: 'short', year: 'numeric'});
  
    return dstr +" - "+fulldt2;
}

class Script {
  /**
   * @params {object} request
   */
  process_incoming_request({ request }) {


  //console is a global helper to improve debug
	// console.log(request.content);
  var myContent = request.content; 
     
  var dateStart = myContent.start.dateTime != null ? new Date(myContent.start.dateTime) :  new Date(myContent.start.date);
  var dateEnd = myContent.end.dateTime != null ? new Date(myContent.end.dateTime) : new Date(myContent.end.date);

	var dateStartText 	= getFormattedDate(dateStart,2);	
	var dateEndtText 	= getFormattedDate(dateEnd,2);

	var duration = 	dateDiff('n', dateStart, dateEnd);
	var durationText;

	if (duration < 300) {
		durationText = duration + ' minutos ';
	} else {
		duration = 	dateDiff('h', dateStart, dateEnd);
		durationText = duration + ' horas ';	

		if (duration > 24) {
			duration = 	dateDiff('d', dateStart, dateEnd);
			durationText = durationText + ' ( ' + duration + ' dias )';	
		}	
	}

    //Apresentação da mensagem      
    var myText = myContent.organizer.displayName ?? "" + "#### :calendar:"+" Google Calendar Event \n";
    myText = myText + '*Resumo:*  ' + myContent.summary + '\n';

    if (myContent.description) {
      myText = myText + '*Descrição:*  ' + myContent.description + '\n';
    }

    myText = myText + '*Início:*  ' + getFormattedDatePtBr(dateStart, myContent.start.dateTime) +'\n';      
    myText = myText + '*Fim:*  '    + getFormattedDatePtBr(dateEnd, myContent.end.dateTime) +'\n';

    if (myContent.location) {
      myText = myText + ':round_pushpin:*  ' + myContent.location + '*\n';     
    }
         
    myText = myText + ':clock330:  *' + durationText + ' * \n';
    myText = myText + ':link:  '      + myContent.htmlLink + '\n';

    if (myContent.hangoutLink) {
    	myText = myText + '*Hangout:*  ' + myContent.hangoutLink + '\n';    	
    }
    
    return {
      content:{
        text: myText
       }
    };

  }
}
