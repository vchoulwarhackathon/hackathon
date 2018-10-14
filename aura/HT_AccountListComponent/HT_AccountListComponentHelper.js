({
    // Function to fetch data from server called in initial loading of page
        fetchAccounts : function(component, event, helper) {
        // Assign server method to action variable
        var action = component.get("c.getAccountList");
        // Getting the account id from page
        //var accountId = component.get("v.recordId");
        // Setting parameters for server method
        /*action.setParams({
            accountIds: accountId
        });*/
        // Callback function to get the response
        action.setCallback(this, function(response) {
            // Getting the response state
            var state = response.getState();
            // Check if response state is success
            if(state === 'SUCCESS') {
                // Getting the list of contacts from response and storing in js variable
                var accountRecList = response.getReturnValue();
                // Set the list attribute in component with the value returned by function
                component.set("v.accountList",accountRecList);
            }
            else {
                // Show an alert if the state is incomplete or error
                alert('Error in getting data');
            }
        });
        // Adding the action variable to the global action queue
        $A.enqueueAction(action);
        },
	getFieldSetDetails : function(component, event, helper) {
        var action = component.get("c.getFieldSet");
        
        // Callback function to get the response
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS') {
                
                var fieldListVar = response.getReturnValue();
                component.set("v.fieldList",fieldListVar);
            }
            else {
                // Show an alert if the state is incomplete or error
                alert('Error in getting data');
            }
        });
        $A.enqueueAction(action);
        },
    getWrapperRecord : function(component, event, helper) {
        var action = component.get("c.getWrapperRecord");
        
        // Callback function to get the response
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS') {
                
                var wrapRecV = response.getReturnValue();
                component.set("v.WrapperRec",wrapRecV);
            }
            else {
                // Show an alert if the state is incomplete or error
                alert('Error in getting data');
            }
        });
        $A.enqueueAction(action);
        },
    getEditRecord : function(component, event, helper,accId) {
        var accoundId = accId;
        console.log('====getEditRecord===='+accoundId)
        var action = component.get("c.editRecord");
        action.setParams({
            acId: accoundId
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS') {
                var wrapRecV = response.getReturnValue();
                component.set("v.WrapperRec",wrapRecV);
            }
            else {
                alert('Error in getting data');
            }
        });
        $A.enqueueAction(action);
        },
    deleteAccountRecord : function(component, event, helper,accId) {
        var accoundId = accId;
        console.log('===deleteAccountRecord=');
        
        var accRecListObj = component.get("v.accountList");
        var accRecList = JSON.stringify(accRecListObj);
        
        console.log('===accRecList=del=='+accRecList);
        
        var action = component.get('c.deleteRecord');
        action.setParams({
            deleteId : accoundId,
            accountListStr : accRecList
        });
        action.setCallback(this, function(actionResult) {
            var res = actionResult.getReturnValue();
            component.set('v.loaded', true);
			console.log('==res==del=='+res);
            var state = actionResult.getState();  
            if (state === 'SUCCESS') {
                var fieldListVar = actionResult.getReturnValue();
                component.set("v.accountList",fieldListVar);
                
            	/*var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "type": "Success",
                    "message": $A.get("Account Saved Successfully!")
                });
            	toastEvent.fire();*/
                }else if(state === 'Error'){
               		var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "type": "Error",
                        "message": $A.get("Error saving account!!") 
                    });
            		toastEvent.fire();
					console.log('==1====');
           		}
            });
        $A.enqueueAction(action);
				console.log('==1====');
		component.set("v.showDelete", false);
    },
    getDummyAcc : function(component, event, helper) {
        var action = component.get("c.getDummyAccount");
        
        // Callback function to get the response
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS') {
                
                var dummyAcc = response.getReturnValue();
                component.set("v.dummyAccount",dummyAcc);
            }
            else {
                // Show an alert if the state is incomplete or error
                alert('Error in getting dummyAcc');
            }
        });
        $A.enqueueAction(action);
        },
    
    fetchPickListVal: function(component, elementId) {
        var action = component.get("c.getselectOptions");
        
        var opts = [];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 
                if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                        class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                component.find(elementId).set("v.options", opts);
            }
        });
        $A.enqueueAction(action);
    },
    updateSourceHelper : function(component, event, helper) {
    	console.log('===updateSourceHelper=');
        var source = component.get('v.selectedSource');
        
        var selectedAccountsJson = component.get("v.selectedAccounts");
        var selectedAccountsStr = JSON.stringify(selectedAccountsJson); //selectedAccountsStr
        
        var accRecListObj = component.get("v.accountList");
        var accRecList = JSON.stringify(accRecListObj);
        
        console.log('===accRecList=del=='+accRecList);
        
        var action = component.get('c.updateAccountsSource');
        action.setParams({
            accountSource : source,
            selectedAccountListStr : selectedAccountsStr,
            accountListStr : accRecList
        });
        action.setCallback(this, function(actionResult) {
            var res = actionResult.getReturnValue();
            component.set('v.loaded', true);
			console.log('==res==del=='+res);
            var state = actionResult.getState();  
            if (state === 'SUCCESS') {
                var fieldListVar = actionResult.getReturnValue();
                component.set("v.accountList",fieldListVar);
               
            }else if(state === 'Error'){
               		var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "type": "Error",
                        "message": $A.get("Error saving account!!") 
                    });
            		toastEvent.fire();
					console.log('==1====');
           		}
            });
        $A.enqueueAction(action);
				console.log('==1====');
		component.set("v.showUpdateSourceModal", false);
    },
    deleteAccountHelper : function(component, event, helper) {
    	console.log('===updateSourceHelper=');
        
        var selectedAccountsJson = component.get("v.selectedAccounts");
        var selectedAccountsStr = JSON.stringify(selectedAccountsJson); //selectedAccountsStr
        
        var accRecListObj = component.get("v.accountList");
        var accRecList = JSON.stringify(accRecListObj);
        
        console.log('===accRecList=del=='+accRecList);
        
        var action = component.get('c.deleteAccounts');
        action.setParams({
            selectedAccountListStr : selectedAccountsStr,
            accountListStr : accRecList
        });
        action.setCallback(this, function(actionResult) {
            var res = actionResult.getReturnValue();
            component.set('v.loaded', true);
			console.log('==res==del=='+res);
            var state = actionResult.getState();  
            if (state === 'SUCCESS') {
                var fieldListVar = actionResult.getReturnValue();
                component.set("v.accountList",fieldListVar);
               
            }else if(state === 'Error'){
               		var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Error!",
                        "type": "Error",
                        "message": $A.get("Error deleting account!!") 
                    });
            		toastEvent.fire();
					console.log('==1====');
           		}
            });
        $A.enqueueAction(action);
				console.log('==1====');
		component.set("v.showDeleteModal", false);
    },
})