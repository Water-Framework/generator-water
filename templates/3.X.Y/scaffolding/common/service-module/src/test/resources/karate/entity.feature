# Generated with Water Generator
# The Goal of feature test is to ensure the correct format of json responses
# If you want to perform functional test please refer to ApiTest

Feature: Check <%-projectSuffixUpperCase%> Rest Api Response

  Scenario: Adding new <%-projectSuffixUpperCase%> with POST

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>'
    # ---- Add entity fields here -----
    And request { "exampleField": "exampleField"}
    # ---------------------------------
    When method POST
    Then status 200
    # ---- Matching required response json ----
    And match response ==
    """
      { "id": 1,
        "entityVersion":1,
        "entityCreateDate":'#number',
        "entityModifyDate":'#number',
        "exampleField": 'exampleField'
       }
    """
    # --------------------------------------------

  Scenario: Updating <%-projectSuffixUpperCase%> entity with PUT

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>'
    # ---- Add entity fields here -----
    And request { "id":1,"entityVersion":1,"exampleField": "exampleFieldUpdated"}
    # ---------------------------------
    When method PUT
    Then status 200
    # ---- Matching required response json ----
    And match response ==
    """
      { "id": 1,
        "entityVersion":2,
        "entityCreateDate":'#number',
        "entityModifyDate":'#number',
        "exampleField": 'exampleFieldUpdated'
       }
    """
    # --------------------------------------------

  Scenario: Find existing <%-projectSuffixUpperCase%> with GET

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>/1'
    # ---------------------------------
    When method GET
    Then status 200
    # ---- Matching required response json ----
    And match response ==
    """
      { "id": 1,
        "entityVersion":2,
        "entityCreateDate":'#number',
        "entityModifyDate":'#number',
        "exampleField": 'exampleFieldUpdated'
       }
    """
    # --------------------------------------------

  Scenario: Testing GET <%-projectSuffixUpperCase%> (find all) response

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
            "id": 1,
            "entityVersion":2,
            "entityCreateDate":'#number',
            "entityModifyDate":'#number',
            "exampleField": 'exampleFieldUpdated'
          }
        ]
      }
    """
    # --------------------------------------------

  Scenario: Deleting existing <%-projectSuffixUpperCase%> entity with DELETE

    Given header Content-Type = 'application/json'
    And header Accept = 'application/json'
    Given url 'http://localhost:8080/water<%- restContextRoot %>/1'
    When method DELETE
    # 204 because delete response is empty, so the status code is "no content" but is ok
    Then status 204