//Facebook SDK
ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set:{
      appId: "485852571574726",
      secret: "d52ce297e2f71b55b175d9471eb6e9d4",
      requestPermissions: ['user_friends', 'emails', 'public_profile']
    }
  }
);

Meteor.methods({
	//Admin
	seedUsers:function(){
		function randomIntFromInterval(min,max){return Math.floor(Math.random()*(max-min+1)+min);}
		for (var i = 0; i < 50; i++) {
			var heightFeet   	 = randomIntFromInterval(3, 7),
				heightInches 	 = randomIntFromInterval(0, 11),
				bodyType	 	 = randomIntFromInterval(0, 8),
				churchAttendance = randomIntFromInterval(0, 4),
				denomination 	 = randomIntFromInterval(0, 10),
				drinks 	 	     = randomIntFromInterval(0, 4),
				smokes 	 	     = randomIntFromInterval(0, 4),
				education 	 	 = randomIntFromInterval(0, 4),
				ethnicity 	 	 = randomIntFromInterval(0, 8),
				eyeColor 	 	 = randomIntFromInterval(0, 7),
				hairColor 	 	 = randomIntFromInterval(0, 9),
				hasKids 	 	 = randomIntFromInterval(0, 1),
				wantsKids 	 	 = randomIntFromInterval(0, 2),
				hasPets 	 	 = randomIntFromInterval(0, 1),
				wantsPets 	 	 = randomIntFromInterval(0, 2),
				petPreference 	 = randomIntFromInterval(0, 2),
				politicalParty 	 = randomIntFromInterval(0, 6),
				language 	     = randomIntFromInterval(0, 12),
				ageMin 	 		 = randomIntFromInterval(18,30),
				ageMax 	 		 = randomIntFromInterval(31,45),
				pref_churchAttendance = randomIntFromInterval(0, 4),
				pref_denomination 	  = randomIntFromInterval(0, 10),
				pref_drinks 	 	  = randomIntFromInterval(0, 4),
				pref_smokes 	 	  = randomIntFromInterval(0, 4),
				pref_education 	 	  = randomIntFromInterval(0, 4),
				pref_ethnicity 	 	  = randomIntFromInterval(0, 8),
				pref_eyeColor 	 	  = randomIntFromInterval(0, 7),
				pref_hairColor 	 	  = randomIntFromInterval(0, 9),
				pref_hasKids 	 	  = randomIntFromInterval(0, 1),
				pref_wantsKids 	 	  = randomIntFromInterval(0, 2),
				pref_hasPets 	 	  = randomIntFromInterval(0, 1),
				pref_wantsPets 	 	  = randomIntFromInterval(0, 2),
				pref_petPreference 	  = randomIntFromInterval(0, 2),
				pref_politicalParty   = randomIntFromInterval(0, 6),
				pref_language   = randomIntFromInterval(0, 12);

			Meteor.users.insert({
				"profile": {
					"userFieldsSet":true,
					"height":{
						"feet":heightFeet,
						"inches":heightInches
					},
					"birthdate":{
						"month":"Jan",
						"day":1,
						"year":1915
					},
					"bodyType":bodyType,
					"churchAttendance":churchAttendance,
					"denomination":denomination,
					"drinks":drinks,
					"smokes":smokes,
					"education":education,
					"ethnicity":ethnicity,
					"eyeColor":eyeColor,
					"hairColor":hairColor,
					"hasKids":hasKids,
					"wantsKids":wantsKids,
					"hasPets":hasPets,
					"petPreference":petPreference,
					"wantsPets":wantsPets,
					"politicalParty":politicalParty,
					"searchable":true,
					"preferences": {
						"gender":"male",
						"distance":100,
						"age": {
							"min":ageMin,
							"max":ageMax
						},
						"education":pref_education,
						"churchAttendance":pref_churchAttendance,
						"denomination":pref_denomination,
						"smokes":pref_smokes,
						"drinks":pref_drinks,
						"ethnicity":pref_ethnicity,
						"hasKids":pref_hasKids,
						"hasPets":pref_hasPets,
						"language":pref_language,
						"petPreference":pref_petPreference,
						"politicalParty":pref_politicalParty,
						"wantsKids":pref_wantsKids,
						"wantsPets":pref_wantsPets
					}
				},
				"services":{
					"facebook": {
						"gender":"female"
					}
				}
			})
		}
		return Meteor.users.find().fetch();
	},

	//Login
	addUserFields:function(userId){
		var user = Meteor.users.find(userId).fetch()[0],
			prefGender = "female";

		//set preference gender
		if (user.services.facebook.gender === "female")
			prefGender = "male";

		Meteor.users.update(userId, {
			$set: { 
				"profile": {
					"userFieldsSet":true,
					"height":{
						"feet":5,
						"inches":0
					},
					"birthdate":{
						"month":"Jan",
						"day":1,
						"year":1915
					},
					"bodyType":0,
					"churchAttendance":0,
					"denomination":0,
					"drinks":0,
					"smokes":0,
					"education":0,
					"ethnicity":0,
					"eyeColor":0,
					"hairColor":0,
					"hasKids":0,
					"wantsKids":0,
					"hasPets":0,
					"petPreference":0,
					"wantsPets":0,
					"politicalParty":0,
					"searchable":false,
					"preferences": {
						"gender":prefGender,
						"distance":100,
						"age": {
							"min":18,
							"max":99
						},
						"education":0,
						"churchAttendance":0,
						"denomination":0,
						"smokes":0,
						"drinks":0,
						"ethnicity":0,
						"hasKids":0,
						"language":0,
						"petPreference":0,
						"hasPets":0,
						"politicalParty":0,
						"wantsKids":0,
						"wantsPets":0
					}
				}
			}
		})
	},

	//Account Page
	setZipcode:function(userId, zipcode){
		var geo = new GeoCoder();
		var result = geo.geocode(zipcode);
		Meteor.users.update(userId, {
			$set:{
				'profile.zipcode':zipcode,
				'profile.city':result[0].city,
				'profile.state':result[0].state,
				'profile.latitude':result[0].latitude,
				'profile.longitude':result[0].longitude
			}
		});
	},
	setInfoTextField:function(userId, fieldValue, fieldName){
		var user = Meteor.users.find(userId).fetch()[0];
		user.profile[fieldName] = fieldValue;
		Meteor.users.update(userId, {
			$set:user
		});
	},
	setAgeMinMax:function(userId, fieldValue, fieldName){
		var user = Meteor.users.find(userId).fetch()[0];
		user.profile.preferences.age[fieldName] = parseInt(fieldValue);
		if (fieldName === "min") {
			if (user.profile.preferences.age.max <= user.profile.preferences.age.min){
				if (user.profile.preferences.age.max < 99)
					user.profile.preferences.age.max = user.profile.preferences.age.min + 1;
			}

		} else if (fieldName === "max") {
			if (user.profile.preferences.age.min >= user.profile.preferences.age.max) {
				if (user.profile.preferences.age.min > 18)
					user.profile.preferences.age.min = user.profile.preferences.age.max - 1;
			}
		}

		Meteor.users.update(userId, {
			$set:user
		});
	},
	accountInfoChange:function(userId, fieldname, option){
		var user = Meteor.users.find(userId).fetch()[0];
		switch(fieldname){
			case "gender":
				Meteor.users.update(userId, {$set:{"services.facebook.gender":option, "profile.gender":option}})
				break;
			default:
				user.profile[fieldname] = parseInt(option);
				Meteor.users.update(userId, {$set:user});
				break;
		}
	},
	accountPrefChange:function(userId, fieldname, option){
		switch(fieldname){
			case "gender":
				Meteor.users.update(userId, {$set:{"preferences.gender":option}})
				break;
			default:
				var user = Meteor.users.find(userId).fetch()[0];
				user.profile.preferences[fieldname] = parseInt(option);
				Meteor.users.update(userId, {$set:user});
				break;
		}
	},
	heightDropdownChange:function(userId, fieldname, option){
		var user = Meteor.users.find(userId).fetch()[0];
		switch(fieldname){
			case "inches":
				Meteor.users.update(userId, {$set:{"profile.height.inches":parseInt(option)}})
				break;
			case "feet":
				Meteor.users.update(userId, {$set:{"profile.height.feet":parseInt(option)}})
				break;
		}
	},
	birthdateDropdownChange:function(userId, fieldname, option){
		var user = Meteor.users.find(userId).fetch()[0];
		switch(fieldname){
			case "year":
				Meteor.users.update(userId, {$set:{"profile.birthdate.year":parseInt(option)}})
				break;
			case "month":
				Meteor.users.update(userId, {$set:{"profile.birthdate.month":option}})
				break;
			case "day":
				Meteor.users.update(userId, {$set:{"profile.birthdate.day":parseInt(option)}})
				break;
		}
	},
	searchableSwitch:function(userId){
		var user = Meteor.users.find(userId).fetch()[0];
		user.profile.searchable = !user.profile.searchable;
		Meteor.users.update(userId,{
			$set:user
		});
	}, 
	infoTextAreaSave:function(userId, fieldName, fieldValue){
		var user = Meteor.users.find(userId).fetch()[0];
		user.profile[fieldName] = fieldValue;
		Meteor.users.update(userId, {
			$set: user
		});
	}
})