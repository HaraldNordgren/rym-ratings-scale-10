
function tagPair ( id, tag ) {
  this.id = id;
  this.tag = tag;
}

var currentTagId = 0;

var activeTags = new Array();
var inactiveTags = new Array();

document.onmousemove = sldMouseMove

var lastX = 0;
var lastY = 0;

function sldMouseMove(e)
{
    if (!e) {e = window.event}

    if ( e.pageX )
    {
    	  lastX = e.pageX;
        lastY = e.pageY;
    } 
    else 
    {
        lastX = e.x+document.body.scrollLeft;
        lastY = e.y+document.body.scrollTop;
    }
}

function setOverlay( show ) 
{

	el = did("overlay");
    if( !el )
    {
        return;
    }
	el.style.visibility = !show ? "hidden" : "visible";
    if ( document.documentElement.scrollHeight )
    {
        el.style.height= document.documentElement.scrollHeight  + 'px'; 
        el.style.width= document.documentElement.scrollWidth  + 'px';

    } else if ( document.body.clientWidth ) {

        el.style.height=document.body.clientHeight + 'px'; 
        el.style.width=document.body.clientWidth + 'px';
    }

   if (did('albumlist')) did('albumlist').style.visibility = show ? "hidden" : "visible";
}

function showTag (event, assoc_id, type, context, show_agg ) {


  var el = document.getElementById('tagger1');
  el.style.position = 'absolute';

  if ( assoc_id == 0 ) 
  {
    assoc_id = did('album_id_tag').innerHTML;
    if ( assoc_id == 0 || assoc_id == '' )
    {
        return;
    }
      el.style.top =  lastY+4 + 'px';
      el.style.left =  lastX+4 + 'px';
   }
   else
   {
      el.style.top =  lastY+4 + 'px';
      el.style.left =  lastX+4 + 'px';
   }


  el.style.visibility ='visible';
  did('tagger_assoc_id').value = assoc_id;
  did('tagger_type').value = type;
  did('tagger_context').value = context;
  sendRequest('LoadTags|' + token + '|' + assoc_id + '|' + type + ',' + context + ',' + show_agg);
  setOverlay(true);

}


function cancelTags ( ) {

  var el = document.getElementById('tagger1');
  el.style.visibility ='hidden';
  el.style.top =  '-500px';
  el.style.left =  '-500px';
  setOverlay(false);
  clear_all_tags();
}
function hideTagDlg()
{
  var el = document.getElementById('tagger1');
  el.style.visibility ='hidden';
  el.style.top =  '-500px';
  el.style.left =  '-500px';
}

function getSelectedTags()
{
  var tags = ''
  if ( activeTags.length ) 
  {
    var first = 1
    for (var id in activeTags )
    {
        if ( first ) 
        {
            first = 0
        }
        else
        {
            tags += ',';
        }
        tags += activeTags[id].tag;
    }
  }
  return tags

}

function saveTags () {

  hideTagDlg();
  var assoc_id = did('tagger_assoc_id').value;
  var type = did('tagger_type').value;
  var context = did('tagger_context').value;


  if ( did('tag_img_' + assoc_id + '_' + type + '_' + context) )
  {
     did('tag_img_'+ + assoc_id + '_' + type + '_' + context ).src = '/images/loading.gif';
  }
  var tags = getSelectedTags();
  sendRequest('SaveTags.2|' + token + '|' + assoc_id + ',' + type + ',' + context + '|' + encodeURIComponent(tags));
  did('tagger_assoc_id').value = 0;
  did('tagger_type').value = '';
  did('tagger_context').value = '';
  clear_all_tags();
  setOverlay(false);
}



   function getElementsByClassName(oElm, strTagName, strClassName){
       var arrElements = (strTagName == "*" && document.all)? document.all : oElm.getElementsByTagName(strTagName);
       var arrReturnElements = new Array();
       strClassName = strClassName.replace(/\-/g, "\\-");
       var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
       var oElement;
       for(var i=0; i<arrElements.length; i++){
           oElement = arrElements[i];      
           if(oRegExp.test(oElement.className)){
               arrReturnElements.push(oElement);
           }   
       }
       return (arrReturnElements)
   }
   function tag_toggle (tagName)
   {
      do_tag_toggle (tagName);

   }

   function do_tag_toggle (tagName)
   {
      var elOn = did('tagger_on');
      var elOff = did('tagger_off');

 
        var tagElId = null;
        var active = false;
        for (var tagid in activeTags )
        {
            if ( activeTags[tagid].tag == tagName )
            {
                tagElId = activeTags[tagid].id;
                active = true;
                inactiveTags.push( activeTags[tagid]);
                activeTags.splice(tagid,1); 
                break;
            }
        }
        if ( !tagElId )
        {
            for (var tagid in inactiveTags )
            {
                if ( inactiveTags[tagid].tag == tagName )
                {
                    tagElId = inactiveTags[tagid].id;
                    active = false;
                    activeTags.push(inactiveTags[tagid]);
                    inactiveTags.splice(tagid,1); 
                    break;
                }
            }
        }
        
        if ( tagElId )
        {
            var tagEl = did(tagElId);
            
            if ( tagEl.className == "taggingbuttonhc" ) 
            {
               tagEl.className = active ?  "taggingbutton" : "taggingnull";
               elOff.parentNode.insertBefore(tagEl.parentNode, elOff);
               return true;
            }
            else
            {
               tagEl.className = "taggingbuttonhc"
               elOn.parentNode.insertBefore(tagEl.parentNode, elOn);
               return true;
            }          
        }

      return false;
   }

   var counter = 0;
   var g_fadeIds = new Array();
   var g_fadeStage = new Array();

   function do_fade()
   {
      if ( g_fadeIds.length == 0 ) { 
         return;
      }
      var r = 0xff;
      var g = 0xdd;
      var b = 0x77;

      var g_newfadeIds = new Array();
      var g_newfadeStage = new Array();
      for (var id in g_fadeStage)
      {
         var el = g_fadeIds[id];
         var stage = g_fadeStage[id];

         var nr = r + Math.floor( (255.0 - r) * (stage / 100.0));
         var ng = g + Math.floor( (255.0 - g) * (stage / 100.0));
         var nb = b + Math.floor( (255.0 - b) * (stage / 100.0));
         el.style.background = 'rgb(' + nr + ',' + ng + ',' + nb + ')';
         stage -= 10
         g_fadeStage[id] = stage;
         if ( stage >= 0 )
         {
            g_newfadeIds.push(el);
            g_newfadeStage.push(stage);             
         } 
         else
         {
            el.style.background ='';
         }  
      }
      g_fadeIds = g_newfadeIds;
      g_fadeStage = g_newfadeStage;
      
      setTimeout("do_fade()", 40);

   }

   function clear_all_tags()
   {    
      var ids = getElementsByClassName(document, "*", 'tagger_tag')
      for ( var id in ids )
      {
        ids[id].parentNode.removeChild(ids[id]);
      }
      activeTags = new Array();
      inactiveTags = new Array();
   }

   function insert_tag ( tagName, on )
   {
       var elDiv =  document.createElement("div");
       elDiv.className = "tagger_tag";

       var elGroup = did(on ? 'tagger_on' : 'tagger_off');
       elGroup.parentNode.insertBefore(elDiv, elGroup);

       var el = document.createElement("a");
       el.id = 'tag' + currentTagId++;

       if ( on )
       {
          activeTags = activeTags.concat(new tagPair(el.id, tagName));
       }
       else
       {
          inactiveTags = inactiveTags.concat(new tagPair(el.id, tagName));
       }
       el.className= on ? "taggingbuttonhc" : "taggingbutton"
       var tagQuoted = tagName.replace(/\\/g, "\\\\");

       var tagQuoted = tagQuoted.replace(/\'/g, "\\'");
       el.href="javascript:tag_toggle('" + tagQuoted + "');" 
       
       el.appendChild(document.createTextNode(tagName));
/*        
       if ( el.text ) 
       { 
           el.text=tagName;
       } 
       else if ( el.innerText )
       {
           el.innerText=tagName;
       }
       else
       {
           el.innerHTML=tagName;
       }*/

       elDiv.appendChild(el);
   }

   function tag_add ()
   {
       var tagName = did('newtag').value;

       var tagNames = tagName.split(',');

       for (var tIndex in tagNames)
       {
           tagName = tagNames[tIndex];
           if ( "" == tagName ||  do_tag_toggle(tagName) )
           {
                continue;
           }
           did('newtag').value = "";
       
           var elDiv =  document.createElement("div");
           elDiv.className = "tagger_tag";
    
           var elOn = did('tagger_on');
           elOn.parentNode.insertBefore(elDiv, elOn);
    
           var el = document.createElement("a");
    
           el.className="taggingbuttonhc"
           el.id = 'tag' + currentTagId++;
           el.style.background = 'rgb(255,255,255)';
    
           activeTags = activeTags.concat(new tagPair(el.id, tagName));
           var tagQuoted = tagName.replace(/\\/g, "\\\\");
           var tagQuoted = tagQuoted.replace(/\'/g, "\\'");
           el.href="javascript:tag_toggle('" + tagQuoted + "');" 
          // el.href="javascript:tag_toggle(" + currentTagId + ");" 
           
           if ( el.text ) 
           { 
               el.text=tagName;
           } 
           else if ( el.innerText )
           {
               el.innerText=tagName;
           }
           else
           {
               el.innerHTML=tagName;
           }
           g_fadeIds.push(el);
           g_fadeStage.push(100);
    
           setTimeout("do_fade()", 100);
    
           elDiv.appendChild(el);
        }
   }
