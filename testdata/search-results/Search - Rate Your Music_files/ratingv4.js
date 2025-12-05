
 var currentratings = new Array();
 function setStars(type, assoc_id, rating, permanent)
 {

      if ( 1 || permanent ) 
      {
         suf = 'f';
      } else {
         suf = 'h';
      }
      for ( i = 1; i <= 5; i++ )
      {
         if ( rating >= (i*2) ) { 
            did('ratingstar_'  + i + 'f' + '_' + type + '_' + assoc_id).style.visibility = 'visible';
            did('ratingstar_' + i + 'e' + '_' + type + '_' + assoc_id).style.visibility = 'hidden';
            did('ratingstar_' + i + 'h' + '_' + type + '_' + assoc_id).style.visibility = 'hidden';
         } else if ( rating == (i*2)-1 ) { 
            did('ratingstar_' + i + 'f' + '_' + type + '_' + assoc_id).style.visibility = 'hidden';
            did('ratingstar_' + i + 'e' + '_' + type + '_' + assoc_id).style.visibility = 'hidden';
            did('ratingstar_' + i + 'h' + '_' + type + '_' + assoc_id).style.visibility = 'visible';
         } else { 
            did('ratingstar_' + i + 'f' + '_' + type + '_' + assoc_id).style.visibility = 'hidden';
            did('ratingstar_' + i + 'e' + '_' + type + '_' + assoc_id).style.visibility = 'visible';
            did('ratingstar_' + i + 'h' + '_' + type + '_' + assoc_id).style.visibility = 'hidden';
         }
      }

      if ( rating == 0 )
      { 
         if ( permanent ) 
         {
            did('fastrating_text' + '_' + type + '_' + assoc_id).innerHTML = ' ' 
         } 
         else 
         {
            did('fastrating_text'+ '_' + type + '_' + assoc_id).innerHTML = '';
         }
      } 
      else
      {
         did('fastrating_text'+ '_' + type + '_' + assoc_id).innerHTML = (rating/2.0).toFixed(1);
      }
 }

 function enterRating(type, assoc_id )  
 { 
   leftrating = 0;
   did('fastrating' + '_' + type + '_' + assoc_id).className = 'fastrating_hover';
 }

 function leaveRating(type, assoc_id, e)
 {
   leftrating = 1;
   setTimeout('doLeaveRating("'+ type + '",' + assoc_id + ');', 40);
 }
 function doLeaveRating(type, assoc_id )  
 {
   if ( leftrating == 1 )
   {
      if (!currentratings[type+assoc_id]) 
      {
         currentratings[type+assoc_id] = 0;
      }
      did('fastrating'+ '_' + type + '_' + assoc_id).className = 'fastrating';
      setStars(type, assoc_id, currentratings[type+assoc_id], true);
   }
 }


 function clickedRating(type, assoc_id, e)
 {

   var ex = e.clientX;

   if ( e.clientX == null ) 
   {
      return
   }
   var pos = Position.get(did('fastrating'+ '_' + type + '_' + assoc_id));
   var ox = pos.left;
   var x = ex-ox;
   if ( ex < 0 || ox < 0 ) 
   {
      return;
   }
   var rating = Math.floor ( (x-1) / 9 ); 
   if ( rating > 10 ) 
   {
      rating = 10;
   }
   if ( rating < 0 )
   {
      rating = 0;
   }
   currentratings[type+assoc_id] = rating;
   did('fastrating_'+ type + '_' + assoc_id).style.display='none';
   did('fastrating_'+ type + '_' + assoc_id + '_loading').style.display='';
   leaveRating(type, assoc_id);
   sendRequest('RateV4|' + token + '|' + type + '|' + assoc_id + '|' + rating);
   

 }

 function mouseMoveRating(type, assoc_id, star, e)
 {
   var ex = e.clientX;

   if ( e.clientX == null ) 
   {
      return
   }
   var pos = Position.get(did('fastrating'+ '_' + type + '_' + assoc_id));
   var ox = pos.left;
   var x = ex-ox;
   if ( ex < 0 || ox < 0 ) 
   {
      return;
   }
   var rating = Math.floor ( (x-1) / 9 ); 
   if ( rating > 10 ) 
   {
      rating = 10;
   }
   if ( rating < 0 )
   {
      rating = 0;
   }

   setStars( type, assoc_id, rating, false );

 }
 
 
/* ############# CATALOG ################# */
 
      var currentType = ''
      var currentAssocId = ''
      var inCatDlg = false;
      var inButton = false;
      var timeoutT = null;
      var ownerships = new Array();
      var user_ownerships = new Array();
      
    function catalogItem ( type, assoc_id, ownership )
    {
       did('catalogbtn_' + type + '_' + assoc_id).innerHTML = '<img src="/images/loading.gif" />';
       sendRequest('CatalogV4|' + token + '|' + type + '|' + assoc_id + '|' + ownership);
      // catalogLeave( type, assoc_id, null);
    }
    function setDlgCatalog ( type, assoc_id, ownership )
    {
         
    }
    function setBtnCatalog ( type, assoc_id, ownership )
    {
         
    }    
    function catalogDlgEnter ( type, assoc_id, event )
    {
          inCatDlg = true;                       
          currentType = type;
          currentAssocId = assoc_id;
          if ( timeoutT )
          {
              clearTimeout(timeoutT);
          }
          doShowCatalog(currentType, currentAssocId);
    }
    function catalogDlgLeave ( type, assoc_id,  event )
    {
          inCatDlg = false;
          if ( timeoutT )
          {
              clearTimeout(timeoutT);
          }                            
          timeoutT = setTimeout('doShowCatalog("' + currentType + '", '  + currentAssocId + ');', 100);
    }
    function catalogEnter ( type, assoc_id, event )
    {
          inButton = true;                       
          currentType = type;
          currentAssocId = assoc_id;
          if ( timeoutT )
          {
              clearTimeout(timeoutT);
          }
          doShowCatalog(type, assoc_id);
    }
    function catalogLeave ( type, assoc_id,  event )
    {
          inButton = false;
          if ( timeoutT )
          {
              clearTimeout(timeoutT);
          }                            
          timeoutT = setTimeout('doShowCatalog("' + type + '", '  + assoc_id + ');', 150);
    }
    function doShowCatalog (type, assoc_id )
    {
          var fl = did('minicatalog');
          var inputEl = did('catalogbtn_' + type + '_' + assoc_id);
          var pos = Position.get(inputEl);
      
          fl.style.top = (pos.top + pos.height + 5) + 'px';
          fl.style.left = pos.left + 'px';
          fl.style.visibility = (inButton||inCatDlg)  ? 'visible' : 'hidden';
    }
 
 