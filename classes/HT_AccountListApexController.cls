public class HT_AccountListApexController {
    
    @AuraEnabled
    public static Account getDummyAccount() { 
        Account dummyAcc = new Account();
        return dummyAcc;
    }
    @AuraEnabled
    public static AccountWrapper getWrapperRecord() { 
        AccountWrapper wrapRec = new AccountWrapper();
        return wrapRec;
    }
    @AuraEnabled
    public static AccountWrapper editRecord(string acId) { 
        system.debug('====editRecord======'+acId);
        Account accountRec = [Select Id, Name,AccountNumber,OwnerId,Owner.name,AccountSource,Parentid,
                              Parent.Name, AnnualRevenue,Type, CreatedBy.name, LastModifiedBy.name,
                              Industry, Description, Phone,Fax   
                          from Account 
                          where Id =:acId Limit 1];
        system.debug('====accountRec======'+accountRec);
        
            AccountWrapper wrap = new AccountWrapper();
            wrap.accountId = accountRec.Id;
            wrap.name = accountRec.Name;
            wrap.AccountNumber = accountRec.AccountNumber;
            wrap.OwnerName = accountRec.Owner.Name;
            wrap.AccountSource = accountRec.AccountSource;
            wrap.Parent = accountRec.Parent;
            wrap.AnnualRevenue = accountRec.AnnualRevenue;
            wrap.Type = accountRec.Type;
            wrap.CreatedByName = accountRec.CreatedBy.Name;
            wrap.LastModifiedByName = accountRec.LastModifiedBy.Name;
            wrap.Industry = accountRec.Industry;
            wrap.Description = accountRec.Description;
            wrap.Phone = accountRec.Phone;
            wrap.Fax = accountRec.Fax;
            wrap.AllowEdit = true;
        
        return wrap;
    }
    @AuraEnabled
    public static AccountWrapper deleteRecord() { 
        AccountWrapper wrapRec = new AccountWrapper();
        return wrapRec;
    }
	@AuraEnabled
    public static List<AccountWrapper> saveAccountRecord(string accWrapper, string accountListStr) { 
        system.debug('===accWrapper====='+accWrapper);
        system.debug('===accountListStr===='+accountListStr);
        List<AccountWrapper> wrapList = new List<AccountWrapper>();
        if(!string.isBlank(accWrapper)){
        	AccountWrapper wrap = (AccountWrapper)System.JSON.deserialize(accWrapper,AccountWrapper.class);
            //List<AccountWrapper> wrapList = (List<AccountWrapper>)System.JSON.deserialize(accountListStr,List<> AccountWrapper.class);
            
            JSONParser parser = JSON.createParser(accountListStr);
            while (parser.nextToken() != null) {
                // Start at the array of invoices.
                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                    AccountWrapper wrapperRec = (AccountWrapper)parser.readValueAs(AccountWrapper.class); 
                    wrapList.add(wrapperRec);
                }
            }  
            Account accRec;
            system.debug('====wrapList=1=='+wrapList);
            system.debug('=====acoountid==='+wrap.accountId);
            if(wrap.accountId != null){
                system.debug('=====udate==='+wrap.accountId);
                accRec = new Account(Id=wrap.accountId);
                //accRec.Id = wrap.accountId;
                List<Integer> toDelete = new List<Integer>();
                for(integer i = 0; i < wrapList.size(); i++){
                    if(wrapList[i].accountId == wrap.accountId){
                        //first add it to the list to delete:
                        toDelete.add(i);
                    } 
                }
                // remove it from your list.
                for(Integer x : toDelete){
                    wrapList.remove(x);
                }
            }else{
                accRec = new Account();
            }
            
            accRec.Name = wrap.Name;
            accRec.AccountNumber = wrap.AccountNumber;
            accRec.AccountSource = wrap.AccountSource;
            accRec.AnnualRevenue = wrap.AnnualRevenue;
            accRec.Type = wrap.Type;
            accRec.Industry = wrap.Industry;
            accRec.Description = wrap.Description;
            accRec.Phone = wrap.Phone;
            accRec.Fax = wrap.Fax;
            upsert accRec;
            system.debug('=====wrap.accountId==='+wrap.accountId);
            /*if(wrap.accountId != null && wrap.accountId != ''){
                system.debug('=====udate===');
                accRec.Id = wrap.accountId;
                update accRec;
            }else{
                system.debug('=====insert===');
                insert accRec;
            }*/
            
            system.debug('====accRec==='+accRec);
			wrap.accountId = accRec.id;     
            wrap.AllowEdit = false;     
            
            wrapList.add(wrap);
            system.debug('====wrapList=2=='+wrapList);
        }
        
        return wrapList;
    }
    
    @AuraEnabled
    public static List<AccountWrapper> deleteRecord(string deleteId, string accountListStr) { 
        system.debug('===deleteRecord====='+deleteId);
        system.debug('==deleteRecord=accountListStr===='+accountListStr);
        List<AccountWrapper> wrapList = new List<AccountWrapper>();
        if(!string.isBlank(deleteId)){
            
            JSONParser parser = JSON.createParser(accountListStr);
            while (parser.nextToken() != null) {
                // Start at the array of invoices.
                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                    AccountWrapper wrapperRec = (AccountWrapper)parser.readValueAs(AccountWrapper.class); 
                    wrapList.add(wrapperRec);
                }
            }  
            Account accRec;
            system.debug('====wrapList=dele=='+wrapList);
            if(deleteId != null){
                system.debug('=====delete==='+deleteId);
                accRec = new Account(Id=deleteId);
                List<Integer> toDelete = new List<Integer>();
                for(integer i = 0; i < wrapList.size(); i++){
                    if(wrapList[i].accountId == deleteId){
                        //first add it to the list to delete:
                        toDelete.add(i);
                    } 
                }
                // remove it from your list.
                for(Integer x : toDelete){
                    wrapList.remove(x);
                }
            }
            
            
           delete accRec;
            system.debug('====wrapList=after delete=='+wrapList);
        }
        
        return wrapList;
    }
    @AuraEnabled
    public static List<Contact> getContactList(List<Id> accountIds) { 
        // Getting the list of contacts from where Id is in accountIds
                List<Contact> contactList = [SELECT Id, Name, Email, Phone, AccountId FROM Contact WHERE AccountId in :accountIds];
                // Returning the contact list
        return contactList;
    }
    
    @AuraEnabled 
    public static List<String> getFieldSet(){
        List<String> fieldSetList = new List<String>();
        /*Schema.SObjectType sObj = Schema.getGlobalDescribe().get('Account');
        FOR(Schema.FieldSet FS : sObj.getDescribe().fieldSets.getMap().values()){
            fieldSetList.add(fs.getName() +'####'+fs.getLabel());
        }*/
        Schema.FieldSet sObjFset = Schema.getGlobalDescribe().get('Account').getDescribe().fieldSets.getMap().get('AccountFields');
        List<Schema.FieldSetMember> fieldSet = sObjFset.getFields();
        //List<FieldSetWrapper> fMaplist = new List<FieldSetWrapper>();
        for (Schema.FieldSetMember fmem: fieldSet) {
        	//fMaplist.add(new FieldSetWrapper(fmem.getLabel(), fmem.getFieldPath(), fmem));
            fieldSetList.add(fmem.getFieldPath());
        }
        
        system.debug('====fieldSetList====='+fieldSetList);
        return fieldSetList;
    }
    
    @AuraEnabled
    public static List<AccountWrapper> getAccountList() { 
        // Getting the list of Account
		List<Account> accountList = [SELECT Id, Name,AccountNumber,OwnerId,Owner.name,AccountSource,Parentid,
                                     Parent.Name, AnnualRevenue,Type, CreatedBy.name, LastModifiedBy.name,
                                     Industry, Description, Phone,Fax  FROM Account 
                                     order by createdDate Desc Limit 10];
        system.debug('====accountList==='+accountList);
		// Returning the Account list
		List<AccountWrapper> accWrapperList = new List<AccountWrapper>();
        for(Account accountRec : accountList){
            AccountWrapper wrap = new AccountWrapper();
            wrap.accountId = accountRec.Id;
            wrap.name = accountRec.Name;
            wrap.AccountNumber = accountRec.AccountNumber;
            wrap.OwnerName = accountRec.Owner.Name;
            wrap.AccountSource = accountRec.AccountSource;
            wrap.Parent = accountRec.Parent;
            wrap.AnnualRevenue = accountRec.AnnualRevenue;
            wrap.Type = accountRec.Type;
            wrap.CreatedByName = accountRec.CreatedBy.Name;
            wrap.LastModifiedByName = accountRec.LastModifiedBy.Name;
            wrap.Industry = accountRec.Industry;
            wrap.Description = accountRec.Description;
            wrap.Phone = accountRec.Phone;
            wrap.Fax = accountRec.Fax;
            wrap.AllowEdit = false;     
            //wrap.accountId = accountRec.Id;
            accWrapperList.add(wrap);
        }
        system.debug('====accWrapperList==='+accWrapperList);
        return accWrapperList;
    }
    
    public class AccountWrapper{
        @AuraEnabled
        public Id accountId{get;set;}
        @AuraEnabled
        public string name{get;set;}
        
        @AuraEnabled
        public string AccountNumber{get;set;}
        @AuraEnabled
        public string OwnerName{get;set;}
        @AuraEnabled
        public string AccountSource{get;set;}
        @AuraEnabled
        public Account Parent{get;set;}
        @AuraEnabled
        public Decimal AnnualRevenue{get;set;}
        @AuraEnabled
        public string Type{get;set;}
        @AuraEnabled
        public string CreatedByName{get;set;}
        @AuraEnabled
        public string LastModifiedByName{get;set;}
        @AuraEnabled
        public string Industry{get;set;}
        @AuraEnabled
        public string Description{get;set;}
        @AuraEnabled
        public string Phone{get;set;}
        @AuraEnabled
        public string Fax{get;set;}
        @AuraEnabled
        public boolean AllowEdit{get;set;}
        
    }
    
    @AuraEnabled
    public static List < String > getselectOptions() {
        sObject objObject = new Account();
        string fld = 'AccountSource';
        system.debug('objObject --->' + objObject);
        system.debug('fld --->' + fld);
        List < String > allOpts = new list < String > ();
        // Get the object type of the SObject.
        Schema.sObjectType objType = objObject.getSObjectType();
        
        // Describe the SObject using its object type.
        Schema.DescribeSObjectResult objDescribe = objType.getDescribe();
        
        // Get a map of fields for the SObject
        map < String, Schema.SObjectField > fieldMap = objDescribe.fields.getMap();
        
        // Get the list of picklist values for this field.
        list < Schema.PicklistEntry > values =
            fieldMap.get(fld).getDescribe().getPickListValues();
        
        // Add these values to the selectoption list.
        for (Schema.PicklistEntry a: values) {
            allOpts.add(a.getValue());
        }
        system.debug('allOpts ---->' + allOpts);
        allOpts.sort();
        return allOpts;
    }
    
    @AuraEnabled
    public static List<AccountWrapper> updateAccountsSource(string accountSource, string selectedAccountListStr, string accountListStr) { 
        system.debug('===selectedAccountListStr==update source==='+selectedAccountListStr+'==source=='+accountSource);
        system.debug('===accountListStr==update source=='+accountListStr);
        set<String> accountIds = new set<String>();
        List<AccountWrapper> wrapList = new List<AccountWrapper>();
        if(!string.isBlank(accountListStr)){
        	//AccountWrapper wrap = (AccountWrapper)System.JSON.deserialize(accountListStr,AccountWrapper.class);
            if(!string.isBlank(selectedAccountListStr)){
                
                List<String> selectedIdsList = new List<String>();
                Object[] values = (Object[])System.JSON.deserializeUntyped(selectedAccountListStr);
                if(values.size()>0){         
                     for (Object id : values) {
                         accountIds.add(string.valueof(id) );
                     }
                 }
                
            	system.debug('====accountIds==='+accountIds);
            }
            JSONParser parser = JSON.createParser(accountListStr);
            while (parser.nextToken() != null) {
                // Start at the array of invoices.
                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                    AccountWrapper wrapperRec = (AccountWrapper)parser.readValueAs(AccountWrapper.class); 
                    wrapList.add(wrapperRec);
                }
            }  
            Account accRec;
            system.debug('====wrapList=1=='+wrapList);
            
            for(AccountWrapper wrapRec : wrapList){
                if(accountIds.contains(wrapRec.accountId)){
					wrapRec.AccountSource = accountSource;
					wrapRec.AllowEdit = false;     
                }
            }
            List<Account> updateAccountSourceList = new List<Account>();
            List<Account> updateAccList = [Select Id,Name,AccountNumber,OwnerId,Owner.name,AccountSource,Parentid,
                                     Parent.Name, AnnualRevenue,Type, CreatedBy.name, LastModifiedBy.name,
                                     Industry, Description, Phone,Fax
                                     from Account where Id IN :accountIds];
            system.debug('====updateAccList==in update source==='+updateAccList);
            for(Account acc : updateAccList){
                acc.AccountSource = accountSource;
                updateAccountSourceList.add(acc);
            }
            if(updateAccountSourceList!=null && !updateAccountSourceList.isEmpty()){
                update updateAccountSourceList;
            }
            //wrapList.add(wrap);
            system.debug('====wrapList=update source=='+wrapList);
        }
        
        return wrapList;
    }
    
    @AuraEnabled
    public static List<AccountWrapper> deleteAccounts(string selectedAccountListStr, string accountListStr) { 
        system.debug('===selectedAccountListStr==delete source==='+selectedAccountListStr);
        system.debug('===accountListStr==delete source=='+accountListStr);
        set<String> accountIds = new set<String>();
        List<AccountWrapper> wrapList = new List<AccountWrapper>();
        if(!string.isBlank(accountListStr)){
        	//AccountWrapper wrap = (AccountWrapper)System.JSON.deserialize(accountListStr,AccountWrapper.class);
            if(!string.isBlank(selectedAccountListStr)){
                
                List<String> selectedIdsList = new List<String>();
                Object[] values = (Object[])System.JSON.deserializeUntyped(selectedAccountListStr);
                if(values.size()>0){         
                     for (Object id : values) {
                         accountIds.add(string.valueof(id) );
                     }
                 }
                
            	system.debug('====accountIds==='+accountIds);
            }
            JSONParser parser = JSON.createParser(accountListStr);
            while (parser.nextToken() != null) {
                // Start at the array of invoices.
                if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                    AccountWrapper wrapperRec = (AccountWrapper)parser.readValueAs(AccountWrapper.class); 
                    wrapList.add(wrapperRec);
                }
            }  
            Account accRec;
            system.debug('====wrapList=1=='+wrapList);
            
            List<Integer> toDelete = new List<Integer>();
			for(integer i = 0; i < wrapList.size(); i++){
				if(accountIds.contains(wrapList[i].accountId)){
					//first add it to the list to delete:
					toDelete.add(i);
				} 
			}
			// remove it from your list.
			for(Integer x : toDelete){
				wrapList.remove(x);
			}
             
            List<Account> deleteAccountSourceList = new List<Account>();
            List<Account> deleteAccList = [Select Id,Name,AccountNumber,OwnerId,Owner.name,AccountSource,Parentid,
                                     Parent.Name, AnnualRevenue,Type, CreatedBy.name, LastModifiedBy.name,
                                     Industry, Description, Phone,Fax
                                     from Account where Id IN :accountIds];
            system.debug('====deleteAccList==in update source==='+deleteAccList);
            for(Account acc : deleteAccList){
                //acc.AccountSource = accountSource;
                deleteAccountSourceList.add(acc);
            }
            if(deleteAccountSourceList!=null && !deleteAccountSourceList.isEmpty()){
                delete deleteAccountSourceList;
            }
            //wrapList.add(wrap);
            system.debug('====wrapList=delete source=='+wrapList);
        }
        
        return wrapList;
    }
    
    
}