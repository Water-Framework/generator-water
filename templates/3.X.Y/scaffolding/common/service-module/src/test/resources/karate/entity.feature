# Generated with Water Generator
# The Goal of feature test is to ensure the correct format of json responses
# If you want to perform functional test please refer to ApiTest
<% if(applicationTypeEntity ) { -%>
Feature: Check <%-projectSuffixUpperCase%> Rest Api Response

  Scenario: <%-projectSuffixUpperCase%> CRUD Operations

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>'
    # ---- Add entity fields here -----
    And request 
    """ { "exampleField": "exampleField"} """
    # ---------------------------------
    When method POST
    Then status 200
    # ---- Matching required response json ----
    And match response ==
    """
      { "id": #number,
        "entityVersion":1,
        "entityCreateDate":'#number',
        "entityModifyDate":'#number',
        "exampleField": 'exampleField'
       }
    """
    * def entityId = response.id
    
    # --------------- UPDATE -----------------------------

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>'
    # ---- Add entity fields here -----
    And request 
    """ { 
          "id":"#(entityId)",
          "entityVersion":1,
          "exampleField": "exampleFieldUpdated"
    } 
    """
    # ---------------------------------
    When method PUT
    Then status 200
    # ---- Matching required response json ----
    And match response ==
    """
      { "id": #number,
        "entityVersion":2,
        "entityCreateDate":'#number',
        "entityModifyDate":'#number',
        "exampleField": 'exampleFieldUpdated'
       }
    """
  
  # --------------- FIND -----------------------------

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>/'+entityId
    # ---------------------------------
    When method GET
    Then status 200
    # ---- Matching required response json ----
    And match response ==
    """
      { "id": #number,
        "entityVersion":2,
        "entityCreateDate":'#number',
        "entityModifyDate":'#number',
        "exampleField": 'exampleFieldUpdated'
       }
    """
    
  # --------------- FIND ALL -----------------------------

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>'
    When method GET
    Then status 200
    And match response ==
    """
      {
        "numPages":1,
        "currentPage":1,
        "nextPage":1,
        "delta":20,
        "results":[
          {
            "id": #number,
            "entityVersion":2,
            "entityCreateDate":'#number',
            "entityModifyDate":'#number',
            "exampleField": 'exampleFieldUpdated'
          }
        ]
      }
    """
  
  # --------------- DELETE -----------------------------

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>/'+entityId
    When method DELETE
    # 204 because delete response is empty, so the status code is "no content" but is ok
    Then status 204
<% } else { -%>
// Since application is not entity based no rest service have been generated, you can add them by yourself
<% } -%>