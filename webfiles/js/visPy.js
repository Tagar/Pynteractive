var data;
var network;

var nodesMap = new vis.DataSet();
var edgesMap = new vis.DataSet();
var groups = new vis.DataSet();
var nodes, edges;

var container = document.getElementById('network');
var data = {};

//layout config
var enabledLayout = 0;
var centralGravityValue = 1.5;
var nodeDistanceValue = 100;

//layout freeze
var freezeLayout = false;
var hideEdgesOnDragLayout = false;

//options layout
var options;

//nodes shapes
//var shapes = ['dot', 'square', 'triangle', 'triangleDown', 'star','circle','ellipse','box'];

//Edges Style
//var line-style = ["line", "arrow", "arrow-center", "dash-line"];

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////    GLOBAL VARIABLE    ////////////////////
////////////////////////////////////////////////////////////
//DATAID
//VTYPE

$(function () {
	//create own html page
	loadHtml();

	//create network visualization
	load();
	PYCON.connect("ws://localhost:8000/")
});

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
///////////////    NETWORK MANAGEMENT    ///////////////////
////////////////////////////////////////////////////////////
function loadHtmlTag(tag) {
	var type = tag.tag;
	var to = tag.to;
	delete tag.tag;
	delete tag.to;
	jQuery('<'+type+'/>', tag).appendTo(to);
}

/**
 * Load html page
 */
function loadHtml() {
	
	//create tools
	var tag = {};

	tag = {tag:'div', to:'#sidebar', id:'containerNetwork'};
	loadHtmlTag(tag);
	
	tag = {tag:'div', to:'#containerNetwork', id:'optionsNetwork'};
	loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id:'labelBarnesHut', text:'BarnesHut'};
	loadHtmlTag(tag);
	
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelBarnesHutRadio', name: 'groupOptionsNetwork', type: 'radio', value: '1', onclick: 'changeLayoutType(id);',	checked: true,};
	loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelRepulsion',
		text: 'Repulsion'};
	loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'labelRepulsionRadio', name: 'groupOptionsNetwork', type: 'radio', value: '0', onclick: 'changeLayoutType(id);', checked: false};
	loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelHierarchicalRepulsion', text: 'Hierarchical'};
	loadHtmlTag(tag);
	
	tag = {tag:'input', to:'#optionsNetwork', id: 'labelHierarchicalRepulsionRadio', name: 'groupOptionsNetwork', type: 'radio', value: '0', onclick: 'changeLayoutType(id);', checked: false};
	loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);
	tag = {tag:'hr', to:'#optionsNetwork'};
	loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelCentralGravity', text: 'Central Gravity'};
	loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderCentralGravity', type: 'range', min: '0', max: '5', step: '0.1', value: '1.5', onclick: 'changeLayoutCentralGravity(value);'};
	loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelNodeDistance', text: 'Node Distance'};
	loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'sliderNodeDistance', type: 'range', min: '0', max: '300', step: '10', value: '100', onclick: 'changeLayoutNodeDistance(value);'};
	loadHtmlTag(tag);
	
	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);
	jQuery('<hr/>', {}).appendTo('#optionsNetwork');

	tag = {tag:'button', to:'#optionsNetwork', id: 'GraphFocus', type: 'button', text: 'Focus', onclick: 'changeGraphFocus();'};
	loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelFreezeLayout', text: 'Freeze Animation'};
	loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'FreezeLayout', type: 'checkbox', onclick: 'changeFreezeLayout();'};
	loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);

	tag = {tag:'label', to:'#optionsNetwork', id: 'labelHideEdgesOnDragLayout', text: 'Hide edges on drag'};
	loadHtmlTag(tag);

	tag = {tag:'input', to:'#optionsNetwork', id: 'HideEdgesOnDragLayout', type: 'checkbox', onclick: 'changeHideEdgesOnDragLayout();'};
	loadHtmlTag(tag);

	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);
	tag = {tag:'br', to:'#optionsNetwork'};
	loadHtmlTag(tag);
	tag = {tag:'hr', to:'#optionsNetwork'};
	loadHtmlTag(tag);
}

/**
 * Load graph on network div html page
 */
function load() {

	//create a network
	container = document.getElementById('network');

	data = {
		nodes: nodesMap,
		edges: edgesMap
	};

	reDrawLayout();

	//add events listener
	network.on('select', selectElement);
	network.on('doubleClick', doubleClickElement);
};

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
/////////////////////    EVENS    //////////////////////////
////////////////////////////////////////////////////////////

/**
 * Select a list of elements from the graph given an ID's [nodes and edges] with select event on graph
 * @param {propesties} properties 
 */
function selectElement(properties){
	var idsNodes = properties.nodes;
	var idsEdges = properties.edges;
	console.log("selectElement");
	console.log(idsNodes);
	console.log(idsEdges);
}

/**
 * Select a list of elements from the graph given an ID's [nodes and edges] with doubleclick event on graph
 * @param {propesties} properties 
 */
function doubleClickElement(properties){
	var idsNodes = properties.nodes;
	var idsEdges = properties.edges;
	console.log("doubleClickElement");
	console.log(idsNodes);
	console.log(idsEdges);
}

////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
////////////////////    FUNCTIONS    ///////////////////////
////////////////////////////////////////////////////////////

/**
 * Change layout type
 * @param {Number} id 
 */
function changeLayoutType(id){

	switch(id) {
		case "labelBarnesHutRadio":
			enabledLayout = 0;
			break;
		case "labelRepulsionRadio":
			enabledLayout = 1;
			break;
		case "labelHierarchicalRepulsionRadio":
			enabledLayout = 2;
			break;
	}
	reDrawLayout();
}

/**
 * Change central gravity of graph
 * @param {Number} value 
 */
function changeLayoutCentralGravity(value){
	centralGravityValue  = value;
	reDrawLayout();
}

/**
 * Change node distance of graph
 * @param {Number} value 
 */
function changeLayoutNodeDistance(value){
	nodeDistanceValue = value;
	reDrawLayout();
}

/**
 * Re paint all the layout taking into account three physics options {barnesHut, barnesHut disabled and hierarchical}
 */
function reDrawLayout(){

	destroy();

	switch(enabledLayout) {
		case 0://smoothCurves: {dynamic:false, type: "continuous"}
			options = {smoothCurves: false, stabilize: false,physics: {barnesHut: {gravitationalConstant: -80000, enabled: true, centralGravity:centralGravityValue, springLength:5}},hideEdgesOnDrag: hideEdgesOnDragLayout};
/*var options = {stabilize: false,
        nodes: {
            shape: 'dot',
            radiusMin: 5,
            radiusMax: 10,
            fontSize: 8,
            fontFace: "Tahoma"
            },
        edges: {
            width: 0.15,
            inheritColor: "from"
            },
        tooltip: {
            delay: 200,
            fontSize: 12,
            color: {
                background: "#fff"
                }
            },
          stabilize: false,
        smoothCurves: {dynamic:false, type: "continuous"},
        physics: {barnesHut: {gravitationalConstant: -80000, springConstant: 0.001, springLength: 200}},
        hideEdgesOnDrag: true
      };*/

			network = new vis.Network(container, data, options);
			break;
		case 1:
			options = {stabilize: false, physics: {barnesHut: {enabled: false}, repulsion: {nodeDistance: nodeDistanceValue, centralGravity: centralGravityValue}},hideEdgesOnDrag: hideEdgesOnDragLayout};
			network = new vis.Network(container, data, options);
			break;
		case 2:
			//"hubsize","directional"
			options = {hierarchicalLayout: {layout: "hubsize"}, physics: {hierarchicalRepulsion: {nodeDistance: nodeDistanceValue}},hideEdgesOnDrag: hideEdgesOnDragLayout};
			network = new vis.Network(container, data, options);
			break;
	}

	reDrawToolLayout();

	network.freezeSimulation(freezeLayout);
}

/**
 * Re paint tool layout taking into account the method selected for network visualization
 */
function reDrawToolLayout() {
	
	switch(enabledLayout) {
		case 0:
			$('#labelCentralGravity').prop( "disabled", false ).removeClass('disabled');
			$("#sliderCentralGravity").prop( "disabled", false ).removeClass('disabled');
			$("#labelNodeDistance").prop( "disabled", true ).addClass('disabled');
			$("#sliderNodeDistance").prop( "disabled", true ).addClass('disabled');
			break;
		case 1: case 2:
			$('#labelCentralGravity').prop( "disabled", true ).addClass('disabled');
			$("#sliderCentralGravity").prop( "disabled", true ).addClass('disabled');
			$("#labelNodeDistance").prop( "disabled", false ).removeClass('disabled');
			$("#sliderNodeDistance").prop( "disabled", false ).removeClass('disabled');
			break;
	}

}

/**
 * Destroy network layout
 */
function destroy() {
	if (network != null) {
	    network.destroy();
	    network = null;
	}
}

/**
 * Set focus on random node
 */
function changeGraphFocus(){
	var options = {position:{x:0, y:0}, scale:0.3, animation: {duration: 1000}};
	network.moveTo(options);
}

/**
 * Enable/Disable animation layout
 */
function changeFreezeLayout(){
	freezeLayout = !freezeLayout;
	network.freezeSimulation(freezeLayout);
}


/**
 * Enable/Disable animation layout
 */
function changeHideEdgesOnDragLayout(){
	hideEdgesOnDragLayout = !hideEdgesOnDragLayout;
	options = {hideEdgesOnDrag: hideEdgesOnDragLayout};
	network.setOptions(options);
}