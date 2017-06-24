document.addEventListener('DOMContentLoaded', load, false);

function load() {
  var doc = document.getElementById("content");
  removePreTags(doc);
  removeEscapedPipes(doc);
  removeEscapedHashes(doc);
  escapeHtml(doc);
  processBody(doc);
  tabulateExamples(doc);
  replaceRemovedEscapedPipes(doc);
  replaceRemovedEscapedHashes(doc);

  var fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
    fontLink.type = 'text/css';
    fontLink.href = 'OpenSans.css';
    document.head.appendChild(fontLink);

}

function escapeHtml(doc) {
    doc.innerHTML = doc.innerHTML.replace(/</g, "&lt;");
    doc.innerHTML = doc.innerHTML.replace(/>/g, "&gt;");
    doc.innerHTML = doc.innerHTML.replace(/"/g, "&quot;");
    doc.innerHTML = doc.innerHTML.replace(/'/g, "&#039;");
}

function tabulateExamples(doc) {
    wrapExamplesInPreTags(doc);
    // Replace first pipe in table
  doc.innerHTML = doc.innerHTML.replace(/^(\s*)\|\s*/gm, '$1');
  // Remove last pipe and any trailing whitespace
  doc.innerHTML = doc.innerHTML.replace(/[ \t]+\|\s*$/gm, '');
  // Trim any remaining whitespace around pipes
  doc.innerHTML = doc.innerHTML.replace(/[ \t]*(\|)[\w]*[ \t]*/g, '$1');

    processTables(doc);
}

function removeEscapedPipes(doc) {
    doc.innerHTML = doc.innerHTML.replace(/\\\|/gmi, '@@@£££@@@');
}

function replaceRemovedEscapedPipes(doc) {
    doc.innerHTML = doc.innerHTML.replace(/\@\@\@£££\@\@\@/gmi, '\\\|');
}

function removeEscapedHashes(doc) {
    doc.innerHTML = doc.innerHTML.replace(/\\\#/gmi, '@@@$$$@@@');
}

function replaceRemovedEscapedHashes(doc) {
    doc.innerHTML = doc.innerHTML.replace(/\@\@\@\$\$\$\@\@\@/gmi, '\\\#');
}

function processTables(doc) {
    var table = '';
    var rows = new Array();
    var columnChars;
    var tableId = "1";
    var currentTableId = "1";
    var columnsInCurrentTable;
    var columnCharLength = [];
    columnCharLength[0] = 0;

    var Tables = document.getElementsByClassName('exampleTable');
    for (var k = 0; k < Tables.length; k++) {
        rows = Tables[k].innerHTML.split('\n');
        table = '<table>';
        currentTableId = Tables[k].getAttribute('data-table-id');
        if(currentTableId != tableId){
            // do the replace on table with the value of columnCharlength
            //table = table.replace(/\^xx\^/g, columnCharLength);
            for(var i = 0; i < columnsInCurrentTable + 1; i++){
                var re = new RegExp("\\^xxcol" + i + "\\^","g");
                doc.innerHTML = doc.innerHTML.replace(re, columnCharLength[i]);
            }
            tableId = currentTableId;
            columnCharLength = [];
            columnCharLength[0] = 0;
        }

        for(var i = 0; i < rows.length-1; i++) {
            var columns = rows[i].split('|');
            table += '<tr>';

            for(var j = 0; j < columns.length; j++) {
                columnsInCurrentTable = j;
                if(columns[j] == ''){
                    table += '<td>NO VALUE</td>';
                    if(columnCharLength[j] < 8) {
                        columnCharLength[j] = 8;
                    }
                    if(rows[i]=='|'){ j++; } // skip the next column
                } else {
                    table += '<td style="width: ^xxcol'+ j +'^ch">' + columns[j] + '</td>';
                    if(columnCharLength[j] < columns[j].length || columnCharLength[j] == undefined) {
                        columnCharLength[j] = columns[j].length;
                    }
                }
            }
            table += '</tr>';
        }

        table += '</table>';
        Tables[k].innerHTML = table;
    }

    for(var i = 0; i < columnsInCurrentTable + 1; i++){
        var re = new RegExp("\\^xxcol" + i + "\\^","g");
        doc.innerHTML = doc.innerHTML.replace(re, columnCharLength[i]);
    }

}

  function generateId() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }


function addFeatureToToc(featureTitle, genId) {
  var featureLink = document.createElement("a");
  featureLink.href = "#" + genId;
  featureLink.innerHTML = featureTitle;
  var featureScenarioList = document.createElement("ol");
  featureScenarioList.classList.add("sectlevel2");
  var featureItem = document.createElement("li");
  featureItem.classList.add("sectlevel1");
  featureItem.appendChild(featureLink);
  featureItem.appendChild(featureScenarioList);
  var toclist = document.getElementById("toclist");
  toclist.appendChild(featureItem);
}

function addScenarioToToc(scenarioTitle, genId) {
  var scenarioLink = document.createElement("a");
  scenarioLink.href = "#" + genId;
  scenarioLink.innerHTML = scenarioTitle;
  
  var scenarioItem = document.createElement("li");
  scenarioItem.classList.add("sectlevel2");
  scenarioItem.appendChild(scenarioLink);
  
  var toclist = document.getElementById("toclist");
  toclist.lastElementChild.lastElementChild.appendChild(scenarioItem);
}

function processBody(doc) {

  // Doc String vars
  var currentlyInsideDocString = false;
    var docStringTagOpen = '<div class="docStringArea">\n<pre class="docString">';
  var docStringTagClose = '</pre>\n</div>\n';
    var docStringRegexp = /^"""/gmi;

  // Comment vars
  var currentlyInsideComment = false;
  var commentOpeningReplacementString = '<div class="comment"><p class="comment-line">$2</p>\n';
  var commentMiddleReplacementString = '<p class="comment-line">$2</p>\n';
  var commentTagClose = '</div>\n';
    var commentRegexp = /^(\s*#\s*)(.*)/gmi;

  // Feature vars
  var currentlyInsideFeatureDescription = false;
    var featureTagOpen = '<blockquote><pre class="featureTitle">\n';
  var featureTagClose = '</pre></blockquote>\n';
    var featureRegexp = /^(Feature|Fonctionnalité):\s*(.*)/gmi;

  // Annotation vars
  var currentlyProcessingAnnotations = false;
    var annotationTagOpen = '<div class="annotations">\n<span class="tagtext">&nbsp;tag(s)&nbsp;</span>';
  var annotationTagClose = '</div>\n';
  var annotationNameTagOpen = '<span class="tag">';
  var annotationNameTagClose = '</span>';
    var annotationRegexp = /^@.*/gmi;

  // Scenario vars
  var scenarioReplacementString = '<p class="scenario-line">$2</p>\n';
    var scenarioRegexp = /(Sc[eé]n.*:[ \t]*)(.*)/gmi;

  // Background vars
    var backgroundTagOpen = '<br><p><span class="h1">';
  var backgroundTagClose = '</span></p>\n';
    var backgroundRegexp = /(Background|Contexte):.*/gmi;

  // Example vars
  var examplesReplacementString = '<p class="examples"><strong><span class="gray">$1</span></strong> $2</p>\n';
    var examplesRegexp = /^(Ex[ae]mples.*:)[ \t]*(.*)/gmi;

  // Keyword vars
    var keywordReplacementString = '<p><span class="keywords">$1</span>$2</p>';
    var keywordRegexp = /^(Given|When|Then|And|But|Etant donné|Et|Alors|Quand)(.*)/gmi;

  // Parameter vars
  var parameterReplacementString = '<span class="param">$1</span>';
  var parameterRegexp = /"?&lt;(.*?)&gt;"?/gmi;

  // Split all by \n
    linesArray = doc.innerHTML.split("\n");

  var parsedText = '';

    
    
    // Process array
    for (var i = 0; i < linesArray.length; i++) {
        var lineText = linesArray[i];

      // Get the line text to be processed
    lineTextLeadingWhitespaceStripped = lineText.replace(/^[ \t]+/gm, '');

    // This block preserves layout inside a pre tag for docStrings - make json look better
     if (!currentlyInsideDocString || lineText.match(/^\s*"""/gmi) != null) {
      lineText = lineTextLeadingWhitespaceStripped;
    }

        // Look for a match on """
        quotesMatch = lineText.match(docStringRegexp);

    // If the lineText includes """ and we're not already inside a docString
    if (quotesMatch != null) {
            if (!currentlyInsideDocString) {
        lineText = docStringTagOpen;
                currentlyInsideDocString = true;
            }
            else {
        lineText = docStringTagClose;
                currentlyInsideDocString = false;
            }
    }

    // Look for a match on #
        commentMatch = lineText.match(commentRegexp);

    // If the lineText includes # and we're not already inside a comment
    if (commentMatch != null && !currentlyInsideDocString) {
            if (!currentlyInsideComment) {
        lineText = lineText.replace(commentRegexp, commentOpeningReplacementString);
      } else {
        lineText = lineText.replace(commentRegexp, commentMiddleReplacementString);
      }
      currentlyInsideComment = true;
    } else {
      if (currentlyInsideComment) {
        lineText = commentTagClose + lineText;
                currentlyInsideComment = false;
      }
    }

    // Look for a match on Feature
        featureMatch = lineText.match(featureRegexp);

    // If the lineText includes Feature: and we're not already inside a feature description
    if (featureMatch != null && !currentlyInsideFeatureDescription && !currentlyInsideDocString) {
            if (!currentlyInsideFeatureDescription) {
                var genId = generateId();
                addFeatureToToc(lineText.replace(featureRegexp,'$2'), genId);
                lineText = lineText.replace(featureRegexp,  '<p><a name="'+ genId +'"></a><span class="h1">Feature</span></p>' + featureTagOpen + '$2');
                currentlyInsideFeatureDescription = true;
            }
    }
    else {
      if (currentlyInsideFeatureDescription && lineText.match(/Background:|Scenario:|Scenario Outline:|Contexte:|Scénario:|Plan du Scénario:|@.*|#.*|"""/gmi) != null) {
        lineText = featureTagClose + lineText;
        currentlyInsideFeatureDescription = false;
      }
    }

    // Look for a match on Annotations e.g. @tag
    annotationMatch = lineText.match(annotationRegexp);

    // If the lineText includes @tag and we're not already processing tags on a line
    if (annotationMatch != null && !currentlyInsideDocString && !currentlyInsideFeatureDescription) {

        if (!currentlyProcessingAnnotations) {
          lineText = lineText.replace(/(@[^\s]*)/mi, annotationTagOpen + '$1');
          lineText = lineText.replace(/@([^\s]*)/gmi, annotationNameTagOpen + '$1' + annotationNameTagClose);
          //lineText = annotationTagOpen + lineText;
        } else {
          lineText = lineText.replace(/@([^\s]*)/gmi, annotationNameTagOpen + '$1' + annotationNameTagClose);
        }
        currentlyProcessingAnnotations = true;
    }
    else {
      if (currentlyProcessingAnnotations) {
        lineText = annotationTagClose + lineText;
        currentlyProcessingAnnotations = false;
      }
    }

    // Look for a match on Scenario
    scenarioMatch = lineText.match(scenarioRegexp);

    // If the lineText includes Scenario: or Scenario Outline:
    if (scenarioMatch != null && !currentlyInsideDocString && !currentlyInsideComment && !currentlyInsideFeatureDescription) {
        var genId = generateId();
        addScenarioToToc(lineText.replace(scenarioRegexp,'$2'), genId);
        lineText = '<a name="'+ genId +'"></a>' + lineText;
        lineText = lineText.replace(scenarioRegexp, scenarioReplacementString);
    }

    // Look for a match on Background
    backgroundMatch = lineText.match(backgroundRegexp);

    // If the lineText includes Background:
    if (backgroundMatch != null && !currentlyInsideDocString && !currentlyInsideComment) {
        lineText = lineText.replace(backgroundRegexp, backgroundTagOpen + '$1' + backgroundTagClose);
    }

    // Look for a match on Examples
    examplesMatch = lineText.match(examplesRegexp);

    // If the lineText includes Examples:
    if (examplesMatch != null && !currentlyInsideDocString && !currentlyInsideComment && !currentlyInsideFeatureDescription) {
        lineText = lineText.replace(examplesRegexp, examplesReplacementString);
    }

    // Look for a match on Keywords
    keywordMatch = lineText.match(keywordRegexp);

    // If the lineText includes Given, When, Then...
    if (keywordMatch != null && !currentlyInsideDocString && !currentlyInsideComment && !currentlyInsideFeatureDescription) {
        lineText = lineText.replace(keywordRegexp, keywordReplacementString);
    }

    // Look for a match on Parameters
    parameterMatch = lineText.match(parameterRegexp);

    // If the lineText includes <parameter>..
    if (parameterMatch != null && !currentlyInsideDocString && !currentlyInsideComment && !currentlyInsideFeatureDescription) {
        lineText = lineText.replace(parameterRegexp, parameterReplacementString);
    }

    // Find next instance of newline
        if(i == linesArray.length - 1) {
      if (currentlyInsideComment) {
        lineText = lineText + "\n" + commentTagClose;
      }
      if (currentlyInsideFeatureDescription) {
        lineText = lineText + "\n" + featureTagClose;
      }
      if (currentlyProcessingAnnotations){
        lineText = lineText + "\n" + annotationTagClose;
      }
      if (currentlyInsideDocString){
        lineText = lineText + "\n" + preTagClose;
      }
      linesArray[i] = lineText;
            break;
        }

    linesArray[i] = lineText;
  }

  var newInnerHTML = "";
  // reconstruct innerHTML from array
  for (var i = 0; i < linesArray.length; i++) {
    newInnerHTML += linesArray[i] + "\n";
  }
  newInnerHTML = newInnerHTML.replace(/\n+$/m, "");

  doc.innerHTML = newInnerHTML;
}

function wrapExamplesInPreTags(doc) {

    var previousLineContainsPipe = false;
    var startOfLine = 0;
    var endOfLine = 0;
    var textToParse = doc.innerHTML;
    var textToParseRemainder = textToParse;
    var lineText = '';
    var preTagOpenTemplate = '<pre class="exampleTable" data-table-id="table_id">\n\n';
    var preTagOpen;
    var preTagClose = '</pre>\n';
    var positionOfNextLineBreak = 0;

    var pipesRegexp = /\|/gmi;
    var escapedPipesRegexp = /\\\|/gmi;
    var scenarioLineRegexp = /<p class="scenario-line">/g;
    var exampleTextRegexp = /Examples:/g;
    var tagLineRegexp = /^<div class="annotations">/g;
    var pipesMatchCount;
    var escapedPipesMatchCount;
    var isScenarioLineOrTagLineOrNextStepLine;
    var numberOfRowsSinceRowWithPipe = 0;
    var dataTableId = 1;
    var isFirstExampleRow = true;
    var isATableOfExamples = false; // as opposed to just a table of data
    var isInsideDocString = false;  // we do nothing with tables if inside a DocString
    var docStringRegexp = /<pre class="docString">/g;
    var preTagCloseRegexp = /<\/pre>/g;

    while (positionOfNextLineBreak != -1) {

        // Find the next line break
        positionOfNextLineBreak = textToParseRemainder.indexOf("\n");

        // Find next instance of newline
        if (positionOfNextLineBreak == -1) {
            endOfLine = textToParse.length;
            textToParse = textToParse + "\n" + preTagClose;
            break;
        } else {
            endOfLine += positionOfNextLineBreak + 1; // Since indexOf is zero-based
        }

        // Get the line text to be processed
        lineText = textToParse.substring(startOfLine, endOfLine);

        // strip leading whitespace
        lineText = lineText.replace(/^[ \t]*\|/gm, '');

        // Get the number of pipes in the line
        pipesMatchCount = (lineText.match(pipesRegexp) || []).length;

        // If this looks like the start of a docString...
        if ((lineText.match(docStringRegexp) || []).length > 0) {
            isInsideDocString = true;
        }

        // If we're not inside a docString
        if (!isInsideDocString) {

            // Get the number of escaped pipes in the line \|
            escapedPipesMatchCount = (lineText.match(escapedPipesRegexp) || []).length;

            // Is the line a new scenario or an annotation?
            if ((lineText.match(scenarioLineRegexp) || []).length == 0 && (lineText.match(tagLineRegexp) || []).length == 0 && (lineText.match(/<span class="keywords">/g) || []).length == 0) {
                isScenarioLineOrTagLineOrNextStepLine = false;
            } else {
                isScenarioLineOrTagLineOrNextStepLine = true;
            }

            // If the lineText includes a pipe and the previous line does not and we're not already within a table
            if ((pipesMatchCount > escapedPipesMatchCount) && !previousLineContainsPipe) {

                // Set the table id for the <pre> tag - we need to do this so that we can group different tables if they belong to the same
                // Scenario Outline Examples (for example, if the table rows are separated by comments or a new Examples label
                preTagOpen = preTagOpenTemplate.replace(/table_id/g, dataTableId);

                // If it's the first row of a new examples table, we wrap this in a <div> so that we can style it as one thing
                if (isFirstExampleRow) {
                    textToParse = [textToParse.slice(0, startOfLine), '<div class="exampleArea">\n' + preTagOpen, textToParse.slice(startOfLine)].join('');
                    endOfLine += preTagOpen.length + 26;
                    isFirstExampleRow = false;
                } else {
                    textToParse = [textToParse.slice(0, startOfLine), preTagOpen, textToParse.slice(startOfLine)].join('');
                    endOfLine += preTagOpen.length;
                }

                // When we move on we need to know state that the previous line contained a pipe
                previousLineContainsPipe = true;
            }
            // If the lineText does not include a pipe and the previous line does i.e. we have left the table (potentially for good in this scenario)
            else if ((pipesMatchCount == escapedPipesMatchCount) && (previousLineContainsPipe || numberOfRowsSinceRowWithPipe > 0)) {

                // Close the <pre> tag (and therefore the table)
                textToParse = [textToParse.slice(0, startOfLine), preTagClose, textToParse.slice(startOfLine)].join('');
                endOfLine += preTagClose.length;

                numberOfRowsSinceRowWithPipe++;

                // When we move on we need to know state that the previous line did not contain a pipe
                previousLineContainsPipe = false;

                // If we've reached a new scenario or annotation (tag) we need to close the <pre> tag and the <div>
                if (isScenarioLineOrTagLineOrNextStepLine) {
                    // The next time we start creating tables we want to know this is the first example row (we open the exampleArea div)
                    isFirstExampleRow = true;

                    // Reset this value for use with the next scenario
                    isATableOfExamples = false;

                    // The next scenario will need a new table ID to assign any example tables
                    dataTableId++;
                    numberOfRowsSinceRowWithPipe = 0;

                    // Close the <pre> tag and the <div>
                    textToParse = [textToParse.slice(0, startOfLine), preTagClose, textToParse.slice(startOfLine)].join('');
                    textToParse = [textToParse.slice(0, startOfLine), "</div> <!-- close exampleArea -->", textToParse.slice(startOfLine)].join('');
                    endOfLine += preTagClose.length + 33; // we just increased the length to add the close pre tag in
                }

            }

        } // end if (isInsideDocString)

    // Check to see if the docString <pre> is closed
    if (((lineText.match(preTagCloseRegexp) || []).length > 0) && isInsideDocString) {
        isInsideDocString = false;
    }

    // We are at the end of the document!
    if (positionOfNextLineBreak == -1) {
        textToParse += "\n" + preTagClose + "</div><!-- close exampleArea --> "; // closing the <div class="exampleArea"> tag
    }

    // Move to the next line - set startOfLine to the end of the previous line
    startOfLine = endOfLine + 1;
    textToParseRemainder = textToParse.substr(endOfLine + 1, textToParse.length - 1);
}
doc.innerHTML = textToParse;
}

function removePreTags(doc) {
    doc.innerHTML = doc.innerHTML.replace(/<\/*pre.*>/g, '');
}
