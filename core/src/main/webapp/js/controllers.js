angular.module('demo.controllers', [])
    .controller('Ctrl', ['$scope', 'Widgets', 'version', function ($scope, Widgets, version) {
        $scope.widgets = Widgets;

        $scope.version = version;

        $scope.angularVersion = angular.version;
    } ])
    .controller('ButtonController', ['$scope', 'Widgets', 'version', function ($scope, Widgets) {
        $scope.widgets = Widgets;

        $scope.showMessage = function(msg) {
            alert(msg);
        };

        $scope.buttonDisabled = true;

        $scope.enableButton = function() {
            $scope.buttonDisabled = false;
        };

        $scope.disableButton = function() {
            $scope.buttonDisabled =  true;
        };

        $scope.buttonTitle = 'change me';

        $scope.buttonVisible = false;

        $scope.showButton = function() {
            $scope.buttonVisible = true;
        };

        $scope.hideButton = function() {
            $scope.buttonVisible =  false;
        };

    } ])
    .controller('PanelController', [ '$scope', 'Widgets', function ($scope, Widgets) {
        $scope.widgets = Widgets;

        $scope.panelOptions = {collapsed: false};

        $scope.expandPanel = function () {
            $scope.panelOptions.collapsed = false;
        };

        $scope.collapsePanel = function () {
            $scope.panelOptions.collapsed = true;
        };

        $scope.panelTitle = "Change me";

        $scope.callbackPanel = {
            toggleable: true,
            closable: true,
            onStateChanged : function() {
                alert('User toggled the panel ');
            },
            onClose: function() {
                alert('user closed the panel');
            }
        }
    } ])
    .controller('TabviewController', [ '$scope', 'Widgets', function($scope, Widgets) {

        $scope.widgets = Widgets;

        $scope.title1 = 'title1';
        $scope.description1 = 'description1';
        $scope.title2 = 'title2';
        $scope.description2 = 'description2';

        $scope.tabSelected = function (index) {
            alert('Tab with index '+ index + ' selected');
        };

        $scope.tabViewOptions = {

        };

        $scope.data = {
            activeTab : 1
        };

        $scope.setActiveTab = function() {
            $scope.tabViewOptions.setActiveTab($scope.data.activeTab);
        };

        $scope.includeList = ["partials/puiTabview/include/panel1.html"
            , "partials/puiTabview/include/panel2.html"];

        $scope.distributedData = {
            field1: "field1"
            , field2: "field2"
            , field3: "field3"
        };

        $scope.addPanel = function() {
            $scope.includeList.push("partials/puiTabview/include/panel3.html");
        }
    } ])
    .controller('InputController', [ '$scope', 'Widgets', function($scope, Widgets) {
        $scope.widgets = Widgets;

        $scope.value1 = 'Change me';

        $scope.numbers = 123;

        $scope.fieldDisabled = true;

        $scope.enableField = function() {
            $scope.fieldDisabled = false;
        };

        $scope.disableField = function() {
            $scope.fieldDisabled =  true;
        };

        $scope.fieldVisible = false;

        $scope.showField = function() {
            $scope.fieldVisible = true;
        };

        $scope.hideField = function() {
            $scope.fieldVisible =  false;
        };
    } ])
    .controller('DatatableController', [ '$scope', '$http', 'Widgets', 'puiGrowl', function($scope, $http, Widgets, puiGrowl) {
        $scope.widgets = Widgets;

        $scope.fixedData =  [
            {'brand':'Volkswagen','year': 2012, 'color':'White', 'vin':'dsad231ff'},
            {'brand':'Audi','year': 2011, 'color':'Black', 'vin':'gwregre345'},
            {'brand':'Renault','year': 2005, 'color':'Gray', 'vin':'h354htr'},
            {'brand':'Bmw','year': 2003, 'color':'Blue', 'vin':'j6w54qgh'},
            {'brand':'Mercedes','year': 1995, 'color':'White', 'vin':'hrtwy34'},
            {'brand':'Opel','year': 2005, 'color':'Black', 'vin':'jejtyj'},
            {'brand':'Honda','year': 2012, 'color':'Yellow', 'vin':'g43gr'},
            {'brand':'Chevrolet','year': 2013, 'color':'White', 'vin':'greg34'},
            {'brand':'Opel','year': 2000, 'color':'Black', 'vin':'h54hw5'},
            {'brand':'Mazda','year': 2013, 'color':'Red', 'vin':'245t2s'}
        ];

        $scope.remoteData = function (callback) {
            $http.get('json/cars.json')
                .then(function(response){
                    $scope.safeApply(  // external changes aren't picked up by angular
                        callback.call(this, response.data)
                    )
                });
        };

        $scope.carTableData = {
            tableData : $scope.fixedData
            , selectionMode : 'single'
            , rowKey : 'vin'
            , onRowSelect: function(event, data) {
                puiGrowl.showInfoMessage('Row selection', 'Selected a '+data.color+ ' '+data.brand+ ' of '+data.year +' (id = '+data.vin+')');
            }
        };

        $scope.paginatedData = {
            tableData : $scope.fixedData
            , paginator : true
            , rows : 4
            , selectionMode : 'single'
            , rowKey : 'vin'
            , onRowSelect: function(event, data) {
                puiGrowl.showInfoMessage('Row selection', 'Selected a '+data.color+ ' '+data.brand+ ' of '+data.year +' (id = '+data.vin+')');
            }
        };

        $scope.multiSelectTableData = {
            tableData : $scope.fixedData
            , selectionMode : 'multiple'
            , rowKey : 'vin'
            , onRowSelect: function(event, data) {
                puiGrowl.showInfoMessage('Row selection', 'Selected a '+data.color+ ' '+data.brand+ ' of '+data.year +' (id = '+data.vin+')');
            }
            , onRowUnselect: function(event, data) {
                if (data) {
                    puiGrowl.showInfoMessage('Row deselection', 'deselected the '+data.color+ ' '+data.brand+ ' of '+data.year +' (id = '+data.vin+')');
                }
            }
        };

        $scope.progSelectTableData = {
            tableData : $scope.fixedData
            , selectionMode : 'multiple'
            , rowKey : 'vin'
            , selectedIndices : []
            , onRowSelect : function(event, data) {
                this.selectedIndices.push($scope.progSelectTableData.tableData.indexOf(data));
            }
            , onRowUnselect: function(event, data) {
                if (data) {

                    this.selectedIndices.splice(this.selectedIndices.indexOf(data.vin, 1));
                } else {
                    this.selectedIndices = [];
                }
            }
        };

        $scope.data = {};
        $scope.data.rowIndex = null;

        $scope.selectDataRow = function() {
            var rowIdx = parseInt($scope.data.rowIndex, 10);
            if (isNaN(rowIdx)) {
                return;
            }
            var index = $scope.progSelectTableData.selectedIndices.indexOf(rowIdx);
            if (index === -1) {
                $scope.progSelectTableData.selectedIndices.push(rowIdx);
                $scope.progSelectTableData.addSelection($scope.progSelectTableData.tableData[rowIdx].vin);
            }
        };

        $scope.unselectDataRow = function() {
            var rowIdx = parseInt($scope.data.rowIndex, 10);
            if (isNaN(rowIdx)) {
                return;
            }
            var index = $scope.progSelectTableData.selectedIndices.indexOf(rowIdx);
            if (index !== -1) {
                $scope.progSelectTableData.selectedIndices.splice(index, 1);
                $scope.progSelectTableData.removeSelection($scope.progSelectTableData.tableData[rowIdx].vin);
            }

        };

        $scope.progPaginatedData = {
            tableData : $scope.fixedData
            , rows : 4
            , paginator : true
            , selectedPage: 0
            , onPage : function(event, data) {
                $scope.safeApply(function() {
                    $scope.progPaginatedData.selectedPage = data;
                });
            }
        };

        $scope.progPage = {
            page : 0
        };

        $scope.setPaginationPage = function() {
          $scope.progPaginatedData.setPaginationPage($scope.progPage.page);
        }

    } ])
    .controller('GrowlController', [ '$scope', 'Widgets', 'puiGrowl', function($scope, Widgets, puiGrowl) {
        $scope.widgets = Widgets;

        $scope.showInfoGrowl = function() {
            puiGrowl.showInfoMessage('Info message title', "Info detail message");
        };

        $scope.showErrorGrowl = function() {
            puiGrowl.showErrorMessage('Error message title', "Error detail message");
        };

        $scope.showWarnGrowl = function() {
            puiGrowl.showWarnMessage('Warn message title', "Warn detail message");
        };

        $scope.showStickyMessage = function() {
            puiGrowl.setSticky(true);
            puiGrowl.clear();
            puiGrowl.showInfoMessage('Message', "Message remains until close icon clicked or other message requested");
        };

        $scope.resetGrowlOptions = function() {
            puiGrowl.setSticky(false);
        }
    } ])
    .controller('AutocompleteController', [ '$scope', 'Widgets',  function($scope, Widgets) {
        $scope.widgets = Widgets;

        $scope.country = null;

        $scope.countries = new Array('Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antarctica', 'Antigua and Barbuda', 'Argentina', 'Armenia',
            'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda',
            'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia',
            'Cameroon', 'Canada', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo, Democratic Republic',
            'Congo, Republic of the', 'Costa Rica', 'Cote d\'Ivoire', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica',
            'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Fiji', 'Finland',
            'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Greenland', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
            'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Jamaica', 'Japan',
            'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea, North', 'Korea, South', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
            'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta',
            'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Mongolia', 'Morocco', 'Monaco', 'Mozambique', 'Namibia',
            'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Panama', 'Papua New Guinea',
            'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Samoa', 'San Marino', ' Sao Tome',
            'Saudi Arabia', 'Senegal', 'Serbia and Montenegro', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
            'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Swaziland', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan',
            'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Uganda', 'Ukraine', 'United Arab Emirates',
            'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe');

        $scope.autoCompleteMethod = function (request, response) {
            var data = [];
            var query = request.query;
            for (var i = 0; i < 5; i++) {
                data.push({"label": query + i, "value": query + i});
            }
            response.call(this, data);
        };

        $scope.fieldDisabled = true;

        $scope.enableField = function () {
            $scope.fieldDisabled = false;
        };

        $scope.disableField = function () {
            $scope.fieldDisabled = true;
        };

        $scope.boundedExample = {
            dropdown: true,
            completeMethod: function (request, response) {
                var data = [];
                var query = request.query;
                for (var i = 0; i < 5; i++) {
                    data.push({"label": query + (i + 10), "value": query + (i + 10)});
                }
                response.call(this, data);
            }
        };

        $scope.multipleCountry = {
            multiple: true
            , completeMethod: $scope.countries
            , multipleValues: []
            , addSelection : function(value) {
                $scope.safeApply(  // external changes aren't picked up by angular
                    $scope.multipleCountry.multipleValues.push(value)
                )
            }
            , removeSelection : function(value) {
                var arr = $scope.multipleCountry.multipleValues,
                    idx = arr.indexOf(value);
                if (idx > -1) {
                    $scope.safeApply(  // external changes aren't picked up by angular
                        $scope.multipleCountry.multipleValues = arr.splice(idx, 1)
                    )
                }
            }
        };

        $scope.limitToList = {
            forceSelection : true
            , completeMethod: $scope.countries
        };

        $scope.callbackOptions = {
            completeMethod: $scope.countries
            , makeSelection: function(label) {
                alert(label + ' selected ');
            }
        };

    } ])
    .controller('FieldsetController', [ '$scope', 'Widgets',  function($scope, Widgets) {
        $scope.widgets = Widgets;

        $scope.fieldsetOptions = {
            toggleable: true,
            collapsed : true
        };

        $scope.collapseFieldset = function() {
            $scope.fieldsetOptions.collapsed = true;
        };

        $scope.expandFieldset = function() {
            $scope.fieldsetOptions.collapsed = false;
        };

        $scope.callbackOptions = {
            toggleable: true,
            onStateChanged : function () {
                alert('User toggled the fieldset');
            }
        };

        $scope.fieldsetName = 'Change me';
    } ])
    .controller('EventController', [  '$scope', 'Widgets',  function($scope, Widgets) {
        $scope.widgets = Widgets;

        $scope.value1 = '';

        $scope.showInfo = function(value) {
            alert('Value of field is '+value);
        };

        $scope.data = {
            name : 'test'
        };

        $scope.showName = function() {
            alert('Current name is  ' + $scope.data.name);
        };

    } ])
    .controller('UtilController', [ '$scope', 'Widgets',  function($scope, Widgets) {
        $scope.widgets = Widgets;

        $scope.focusField = function() {
            $scope.focus("#focus");
        }
    } ])
    .controller('puiPanel', [ function() {

    } ]);