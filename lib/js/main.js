/* document.querySelector('#inputMathML').addEventListener('keyup', () => {
    document.querySelector('#showTxt').innerHTML = document.querySelector('#inputMathML').textContent.replace(/\s/g, "");
})

document.querySelector('#showTxt').addEventListener('keyup', () => {
    document.querySelector('#inputMathML').textContent = document.querySelector('#showTxt').innerHTML;
}) */

const loadFraction = (tabName) => {

    // Remove current Equation Tab, then change to another
    try {
        document.querySelector('#representEquation .fractionToShow').remove();

        let arrElm = document.querySelectorAll('.equationTab .tabItem');
        arrElm.forEach(elm => {
            elm.classList.remove('active')
        });
    }
    catch (err) {
        console.log(err);
    }

    document.querySelector(`#${tabName}`).classList.add('active');

    let tabStorage = '';

    switch(tabName) {
        case 'geomertryTab':
            tabStorage = 'Geomertry';
            break;
        case 'greekLetterTab':
            tabStorage = 'Greek Letter';
            break;
        case 'operatorTab':
            tabStorage = 'Operator';
            break;
        case 'arrowTab':
            tabStorage = 'Arrow';
            break;
        default:
            tabStorage = 'Basic Math';
            break;
    }

    $.getJSON(`../../assets/eqs/${tabStorage}/staticList.json`, function( data ) {
        var items = [];
        data.forEach(frac => {
           items.push(`<button class='fraction-item'
            title='${frac.name}'
            onclick="execCmd(this.innerHTML)" >${frac.laTex}</button>`);
        });

        $( "<div/>", {
          "class": "fractionToShow",
          html: items.join( "" )
        }).appendTo( "#representEquation" );
      });
}

// exec command when hit any button
const execCmd = ( key ) => {
    let htmlCode = `${key}`; //&nbsp;
    document.execCommand(`insertHTML`, false, htmlCode);
}

/* ================= TEMPLATE ================= */

// Bold menu
document.querySelector('#bold-button').addEventListener('click', function() {
    document.execCommand('bold');
});

// Underline menu
document.querySelector('#underline-button').addEventListener('click', function() {
    document.execCommand('underline');
});

// Italic menu
document.querySelector('#italic-button').addEventListener('click', function() {
    document.execCommand('italic');
});

// List menu
document.querySelector('#list-button').addEventListener('click', function() {
    document.execCommand('insertUnorderedList');
});

// Picture menu
document.querySelector('#image-button').addEventListener('click', function() {
    document.execCommand('insertImage', false, 'http://www.ctsols.com/wp-content/uploads/2015/09/ECM2-470x303.jpg');
});

// Check menu options to be highlighted on keyup and click event 
document.querySelector('#editor-text').addEventListener('keyup', FindCurrentTags);
document.querySelector('#editor-text').addEventListener('click', FindCurrentTags);

function FindCurrentTags() {
    // Editor container 
    var editor_element = document.querySelector('#editor-text');
    
    // No of ranges
    var num_ranges = window.getSelection().rangeCount;

    // Will hold parent tags of a range
    var range_parent_tags;

    // Will hold parent tags of all ranges
    var all_ranges_parent_tags = [];
        
    // Current menu tags
    var menu_tags = [ 'B', 'I', 'UL', 'U' ];
        
    // Will hold common tags from all ranges
    var menu_tags_common = [];

    var start_element,
        end_element,
        cur_element;

    // For all ranges
    for(var i = 0; i < num_ranges; i++) {
        // Start container of range
        start_element = window.getSelection().getRangeAt(i).startContainer;
        
        // End container of range
        end_element = window.getSelection().getRangeAt(i).endContainer;
        
        // Will hold parent tags of a range
        range_parent_tags = [];

        // If starting node and final node are the same
        if(start_element.isEqualNode(end_element)) {
            // If the current element lies inside the editor container then don't consider the range
            // This happens when editor container is clicked
            if(editor_element.isEqualNode(start_element)) {
                all_ranges_parent_tags.push([]);
                continue;
            }

            cur_element = start_element.parentNode;
            
            // Get all parent tags till editor container    
            while(!editor_element.isEqualNode(cur_element)) {
                range_parent_tags.push(cur_element.nodeName);
                cur_element = cur_element.parentNode;
            }
        }

        // Push tags of current range 
        all_ranges_parent_tags.push(range_parent_tags);
    }

    // Find common parent tags for all ranges
    for(i = 0; i < menu_tags.length; i++) {
        var common_tag = 1;
        for(var j = 0; j < all_ranges_parent_tags.length; j++) {
            if(all_ranges_parent_tags[j].indexOf(menu_tags[i]) == -1) {
                common_tag = -1;
                break;
            }
        }

        if(common_tag == 1)
            menu_tags_common.push(menu_tags[i]);
    }

    // Highlight menu for common tags
    if(menu_tags_common.indexOf('B') != -1)
        document.querySelector("#bold-button").classList.add("highight-menu");
    else
        document.querySelector("#bold-button").classList.remove("highight-menu");

    if(menu_tags_common.indexOf('U') != -1)
        document.querySelector("#underline-button").classList.add("highight-menu");
    else
        document.querySelector("#underline-button").classList.remove("highight-menu");

    if(menu_tags_common.indexOf('I') != -1)
        document.querySelector("#italic-button").classList.add("highight-menu");
    else
        document.querySelector("#italic-button").classList.remove("highight-menu");

    if(menu_tags_common.indexOf('UL') != -1)
        document.querySelector("#list-button").classList.add("highight-menu");
    else
        document.querySelector("#list-button").classList.remove("highight-menu");
}

// Handle submit
const sendData = () => {
    let htmlCode = document.querySelector('#editor-text').innerHTML;
    alert(htmlCode);
}