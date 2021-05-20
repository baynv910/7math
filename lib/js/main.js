// check Browser if FireFox or Safari : all browser enable MathML
let isFireFox = (typeof InstallTrigger !== 'undefined');
let isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

if (isFireFox == true || isSafari == true) {
    document.querySelector('.checkingBrowser').classList.remove('active');
} else
{
    console.log('Not FireFox or Safari Browser! Then not support MathML to render this page!');
    document.querySelector('.container-fluid').innerHTML = '';
}
 

 var myHeaders = new Headers();
 myHeaders.append('Access-Control-Allow-Origin', '*');

// Display all Fraction in the 1st page load event
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
            onclick="execCmd(this.innerHTML)" >${frac.symbol}</button>`);
        });

        $( "<div/>", {
          "class": "fractionToShow",
          html: items.join( "" )
        }).appendTo( "#representEquation" );
      });
}

// exec command when hit any button on menu (not on keyboard)
const execCmd = ( key ) => {
    let htmlCode = `${key}&nbsp;`;
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
    var menu_tags = [ 'B', 'I', 'U' ];
        
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
}

// Handle File Upload
execFileUpload = () => {
    let linkFile = document.querySelector('#linkMyFile').value;
    let btnReadFile = document.querySelector('#btnReadFile');

    console.log(linkFile);
    if (linkFile == null || linkFile == '')
       alert('Please upload a file!');
    else {
        btnReadFile.disabled = 'true';
        btnReadFile.value = 'Reading';
    
        Tesseract.recognize(
            `${linkFile}`,
            'vie',
            { logger: m => console.log(m) }
            ).then(({ data: { text } }) => {
            console.log('Completed! Check data in your output box!');
            // Update button status
            btnReadFile.disabled = !btnReadFile.disabled;
            btnReadFile.value = 'Read File';
            execCmd(text);
        })
    }
}

// Handle submit
const sendData = () => {
    let htmlCode = document.querySelector('#editor-text').innerHTML;
    alert(htmlCode);
}