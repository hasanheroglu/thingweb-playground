
// import * as util from "./util"
// const util = require('./util')
import * as util from "./util.js"
// setTimeout(()=>{monaco.editor.setTheme("vs-dark")},2000)

// fetch('./list.json')
// .then(res => res.json())
// .then(data => console.log(data))

const manualAssertions = [];
const results = [];
// const $ = require("jquery")
let autoValidate = false
// $(document).ready(function(){ shouldn't be necessary since script tag is at the bottom of html

  	// when table is extracted
	// $("#validation_table").fadeOut("fast",function(){
	// 	$("#table_head_arrow").removeClass();
    //     $("#table_head_arrow").toggleClass("down");
	// })

    document.getElementById("validation_table_head").addEventListener("click", ()=>{
        util.toggleValidationStatusTable()
    })
    // $("#validation_table_head").click(toggleValidationStatusTable);// Toggles Validation Table view
    document.getElementById("box_auto_validate").addEventListener("change", () => {
        autoValidate = document.getElementById("box_auto_validate").checked
        console.log("autoValidate = " + autoValidate)
    })
	// $("#box_auto_validate").change(function(){ // Auto validates only when the box is checked.
	// 	autoValidate=$("#box_auto_validate").prop("checked");
	// });

//	$("#btn_assertion_popup").click(function(event){ // show assertion test popup
//		event.preventDefault();

//		$.ajax({
//			type: "GET",
//			url: "manual.csv",
//			dataType: "text",
//			success(data) {fetchManualAssertions(data);}
//		});

		/*
			For the given CSV data of assertions, it parses them uses Papa library
			and pushes them as JSON objects in an array
		*/
		// function fetchManualAssertions(allText) {
		// 	manualAssertions=[]
		// 	var assertionData = Papa.parse(allText).data;
		// 	for (let index = 1; index < assertionData.length; index++) { //1 and not 0 since the 0th is the header
		// 		var element = assertionData[index];
		// 		var singleAssertionJSON = {"ID":element[0],"Status":element[1],"Comment":element[2],"Description":element[3]};
		// 		manualAssertions.push(singleAssertionJSON);
		// 	}

		// 	$.each( manualAssertions, function( i, assertion ) {
		// 		var htmlrow =
		// 			"<td style=\"padding-left: 1em;\">" + i + "</td>" +
		// 			"<input type='hidden' value="+i+">"+
		// 			"<td style=\"padding-left: 1em;\">" + assertion.ID + "</td>" +
		// 			"<td>"+
		// 			"<input type='radio' value='null' name='status"+i+"'/>null"+
		// 			"<input type='radio' value='not-impl' name='status"+i+"'/>not-impl"+
		// 			"<input type='radio' value='impl' name='status"+i+"'/>impl"+
		// 			"<td style=\"padding-left: 1em;\">" + assertion.Description + "</td>" ;
		// 		$("<tr/> </table>").html(htmlrow).appendTo("#manual_assertion_table_body");
		// 		$('input:radio[name=status'+i+"]")[0].checked = true;

		// 	});

		// 	$('input[type="radio"]').on('change', function() {
		// 		indexnum= $(this).parent().parent().find("input[type=hidden]").first().val()
		// 		manualAssertions[indexnum]["Status"]=$(this).val()
		// 	});
		// }

//		$("#assertion_test_popup").css("display","block");
//	});

//	$("#close_assertion_test_popup").click(function(event){// close assertion test popup
//		event.preventDefault();
//		$("#assertion_test_popup").css("display","none");
//	})

	const urlAddrObject= util.getExamplesList(); // Fetching list of examples from the given array(in helperFunctions.js).
	util.populateExamples(urlAddrObject);     // Loading the examples given in list from their respective URLs

    document.getElementById("load_example").addEventListener("change", e => {util.exampleSelectHandler(e, {urlAddrObject})})
    // $("#load_example").change({urlAddrObject},exampleSelectHandler);// attaching handler to the drop down menu of the examples list.

    document.getElementById("editor_theme").addEventListener("change", () => {
        window.monaco.editor.setTheme(document.getElementById("editor_theme").value);
    })
	//	$("#editor_theme").change(function(event){window.monaco.editor.setTheme($("#editor_theme").val())})

    // document.addEventListener("click", performAssertionTest)
	// $("#btn_assertion").click(performAssertionTest);// attaching function to the assertion button,
	// the function performs Assertion test

    document.getElementById("btn_validate").addEventListener("click", () => {util.validate({source:"manual"})})
	// $("#btn_validate").click({source:"manual"},validate);// attaching Function to the Validate(Manual) Button.

	// document.getElementById("btn_gistify").addEventListener("click", submitAsGist)
	// $("#btn_gistify").click(submitAsGist);// Attaching Function to Gistify Button, The functions handles submitting TD as Gist.

	document.getElementById("btn_clearLog").addEventListener("click", util.clearLog)
	// $("#btn_clearLog").click(clearLog); // Clear logs

	// document.getElementById("td-text").addEventListener("keydown", util.textAreaManipulation)
	// $("#td-text").keydown(textAreaManipulation);// Text area manipulation

//* *************************Monaco editor code*********************************////
// Load monaco editor ACM
// require.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' }});
// require(['vs/editor/editor.main'], function() {
//     const editor = monaco.editor.create(document.getElementById('monaco'), {
//         value: [
//             'function x() {',
//             '\tconsole.log("Hello world!");',
//             '}'
//         ].join('\n'),
//         language: 'javascript'
//     });
// });
let editor
require.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], editor=function() {

	const jsonCode = [].join('\n'); // Temporary initial Json
	const modelUri = monaco.Uri.parse("a://b/foo.json"); // a made up unique URI for our model
	const model = monaco.editor.createModel(jsonCode, "json", modelUri);

	fetch("./node_modules/playground-core/td-schema.json")
	.then(res => res.json())
	.then( json => {
		const tdSchema=json;

		// configure the JSON language support with schemas and schema associations
		monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
			validate: true,
			// schemas: [schema] // List of schemas to validate against, It will validate the TD with in the editor area.
			schemas:[{
				fileMatch: [modelUri.toString()], // associate with our model
				schema:tdSchema
			}
			]
		});

		window.editor=monaco.editor.create(document.getElementById("monaco"), {
			model,
			contextmenu: false,
			theme:"vs"
		});

		document.getElementById("curtain").style.display = "none"
		// $("#curtain").css("display","none")

		model.onDidChangeContent(event => { // When text in the Editor changes
			util.validate(event, "auto", autoValidate)
			console.log("text changed")
		});
	}, err => {
		console.error("loading TD schema for editor failed" + err)
	})
	// $.getJSON("td-schema.json",function(json){
	// 	const tdSchema=json;

	// 	// configure the JSON language support with schemas and schema associations
	// 	monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
	// 		validate: true,
	// 		// schemas: [schema] // List of schemas to validate against, It will validate the TD with in the editor area.
	// 		schemas:[{
	// 			fileMatch: [modelUri.toString()], // associate with our model
	// 			schema:tdSchema
	// 		}
	// 		]
	// 	});

	// 	window.editor=monaco.editor.create(document.getElementById("monaco"), {
	// 		model,
	// 		contextmenu: false,
	// 		theme:"vs"
	// 	});

	// 	$("#curtain").css("display","none")

	// 	model.onDidChangeContent(event => { // When text in the Editor changes
	// 		validate(event,"auto");
	// 	});
	// });
});

// });