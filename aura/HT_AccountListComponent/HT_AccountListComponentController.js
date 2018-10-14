({
    // Function called on initial page loading to get contact list from server
        doInit : function(component, event, helper) {
        // Helper function - fetchAccounts called for interaction with server
        		
                helper.fetchAccounts(component, event, helper);
            	helper.getFieldSetDetails(component, event, helper);
            	helper.getWrapperRecord(component, event, helper);
            	//helper.getDummyAcc(component, event, helper);
            	
            
        },

    // Function used to create a new Contact
    newContact: function(component, event, helper) {
        // Global event force:createRecord is used
        var createContact = $A.get("e.force:createRecord");
        // Parameters like apiName and defaultValues are set
        createContact.setParams({
            "entityApiName": "Contact",
            "defaultFieldValues": {
                "AccountId": component.get("v.recordId")
            }
        });
        // Event fired and new contact dialog open
        createContact.fire();
    },
    
    showDetails: function(component, event, helper) {
        component.set('v.loaded', false);
        var accId = event.target.dataset.name; 
        console.log('===accId=new=='+accId);
		component.set("v.AccoundId", accId);
        component.set("v.isShow", true);
        component.set('v.loaded', true);
	},
    createNew: function(component, event, helper) {
        helper.getWrapperRecord(component, event, helper);
        component.set('v.showNewAccountModal', true);
		 
	},
    updateAccount: function(component, event, helper) {
        console.log('===updateAccount=');
        
        var accRecListObj = component.get("v.accountList");
        var accRecList = JSON.stringify(accRecListObj);
        
        var wrapVarRec = component.get("v.WrapperRec");
        var wrapVar = JSON.stringify(wrapVarRec);
        
        console.log('===accRecList==='+accRecList);
        console.log('===wrapVar==='+wrapVar);
        var action = component.get('c.saveAccountRecord');
        action.setParams({
            accWrapper : wrapVar,
            accountListStr : accRecList
        });
        action.setCallback(this, function(actionResult) {
            var res = actionResult.getReturnValue();
            component.set('v.loaded', true);
			console.log('==res===='+res);
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
		component.set("v.showEdit", false);
        
	},
    SaveAccount: function(component, event, helper) {
        console.log('===save=');
        
        var accRecListObj = component.get("v.accountList");
        var accRecList = JSON.stringify(accRecListObj);
        
        var wrapVarRec = component.get("v.WrapperRec");
        var wrapVar = JSON.stringify(wrapVarRec);
        
        console.log('===accRecList==='+accRecList);
        console.log('===wrapVar==='+wrapVar);
        var action = component.get('c.saveAccountRecord');
        action.setParams({
            accWrapper : wrapVar,
            accountListStr : accRecList
        });
        action.setCallback(this, function(actionResult) {
            var res = actionResult.getReturnValue();
            component.set('v.loaded', true);
			console.log('==res===='+res);
            var state = actionResult.getState();  
            if (state === 'SUCCESS') {
                var fieldListVar = actionResult.getReturnValue();
                component.set("v.accountList",fieldListVar);
                helper.fetchAccounts(component, event, helper);
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
		component.set("v.showNewAccountModal", false);
        
	},
    closeModal: function(component, event, helper) {
        component.set('v.showNewAccountModal', false);
    },
    closeEditModal: function(component, event, helper) {
        component.set('v.showEdit', false);
    },
    closeDeleteModal : function(component, event, helper) {
        component.set('v.showDelete', false);
    },
    onEdit: function(component, event, helper) {
        component.set('v.showEdit', true);
        var accId = event.target.dataset.name; 
        console.log('===onEdit=='+accId);
        helper.getEditRecord(component, event, helper,accId);
		
	},
    onDelete: function(component, event, helper) {
        component.set('v.loaded', false);
        var accId = event.target.dataset.name; 
        console.log('===onDelete=='+accId);
        helper.deleteAccountRecord(component, event, helper,accId);
	},
     //Select all Accounts
    handleSelectedAllAccounts : function(component, event, helper) {
        var selectedAccounts = [];
        var getID = component.get("v.mapValues");
        var checkvalue = component.find("selectAll").get("v.value");    
        console.log('===checkvalue======='+checkvalue);
        var selID = component.get("v.isSelectAll");
        console.log('=====selID====='+selID);
        var checkAccount = component.find("checkAccount"); 
        console.log('=====checkAccount====='+checkAccount);
        if(checkvalue == true){
            console.log('====in checkvalue====='+checkvalue);
            //console.log('====length====='+checkAccount.length);
            for(var i=0; i<checkAccount.length; i++){
                //console.log('=====checkAccount[i]====='+checkAccount[i]);
                if(checkAccount[i].get("v.disabled") != true){
                	checkAccount[i].set("v.value",true);
                    
                    console.log('==checkAccount[i]==='+checkAccount[i]);
                    console.log('==checkAccount[i].get("v.text")==='+checkAccount[i].get("v.text"));
                    selectedAccounts.push(checkAccount[i].get("v.text"));
                    
                }
            }
        }
        else{ 
            for(var i=0; i<checkAccount.length; i++){
                if(checkAccount[i].get("v.disabled") != true){
                	checkAccount[i].set("v.value",false);
                    if (selectedAccounts.indexOf(checkAccount[i].get("v.text")) > -1) {
                    	selectedAccounts.splice(selectedAccounts.indexOf(checkAccount[i].get("v.text")), 1);
                    }
                }
            }
        }
        console.log('selectedAccounts-' + selectedAccounts);
        
        component.set("v.selectedAccounts", selectedAccounts);
    },
    //Process the selected Account
    handleSelectedAccounts: function(component, event, helper) {
        var selectedAccount = [];
        var checkvalue = component.find("checkAccount");
         
        if(!Array.isArray(checkvalue)){
            if (checkvalue.get("v.value") == true) {
                selectedAccount.push(checkvalue.get("v.text"));
            }
        }else{
            for (var i = 0; i < checkvalue.length; i++) {
                if (checkvalue[i].get("v.value") == true) {
                    selectedAccount.push(checkvalue[i].get("v.text"));
                }
            }
        }
        console.log('selectedAccount-' + selectedAccount);
        component.set("v.selectedAccounts", selectedAccount);
    },
    showUpdateSourceModal: function(component, event, helper) {
    	component.set('v.showUpdateSourceModal', true);
        helper.fetchPickListVal(component, 'accSource');
    },
    deleteAllConfirm: function(component, event, helper) {
        component.set("v.showDeleteModal", true);
        
    },
    deleteAll: function(component, event, helper) {
    	var selectedAccounts = component.get("v.selectedAccounts");
        alert('delete all'+selectedAccounts);
        helper.deleteAccountHelper(component, event, helper);
        
    },
    closeUpdateSource: function(component, event, helper) {
        component.set('v.showUpdateSourceModal', false);
    },
    closeDeleteModal: function(component, event, helper) {
        component.set('v.showDeleteModal', false);
    },
    onPicklistChange: function(component, event, helper) {
        // get the value of select option
        var source = event.getSource().get("v.value");
        component.set('v.selectedSource', source);
        
    },
    updateAccountSource: function(component, event, helper) {
        var source = component.get('v.selectedSource');
        var selectedAccounts = component.get("v.selectedAccounts");
        alert('saveee'+selectedAccounts);
        //component.set('v.showUpdateSourceModal', false);
        helper.updateSourceHelper(component, event, helper);
    },
})