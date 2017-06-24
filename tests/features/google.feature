# features/google.feature

Feature: Google Search

Scenario: Opening Google
  Given I open Google's search page
  Then the title is "Google"
  And the Google search form exists

Scenario Outline: Searching "<searchTerms>" in Google
  Given I open Google's search page
  When I type "<searchTerms>" in the search form
  Then the first result contains "<resultText>"
Examples:
| searchTerms | resultText |
| rembrandt van rijn | Rembrandt |
| renoir | Auguste Renoir |
| picasso | Accueil \| Picasso |
