import dayjs from 'dayjs';
import pug from 'pug';
import { BPMNAPI, BPMNServer, DefaultAppDelegate, Logger, SecureUser } from '../index.js';

/**
	is called by a script 
	
	1.	Notify involved users at a certain event (done by script)
		need to find a way of getting involved users ?
	2.	Allow users to respond through email , 
		by having a url unique for the user that takes them straight to complete the task
		
	
	
	
	createNotification(item,to,when,message,template)

	who:	user/usergroup/expression (assignee/designated/initiator)
			
	when	on/before/after difference 
			event:	Start/End/Assign/DueDate/Follow-up
	message

	to:[{user:['user1','user2','$supervisor()']},{group:['managers','HR',$item.candidateUserGroups]}]
	timer: dateAdd(item.dueDate,-10,'day')}
	message:`New Task for you to address ${item.name} - ${item.data.requestType}`
	template: 'default'

	Timer events will not be issued once item is complete


	createNotification(item,to,when,message,template)

	users Map
		user1,group1
		user2,group2
		user3,group3
		user12,group1,group2
		user13,group1,group2,group3
		
**/

class AppUtils {
	server;

	constructor(server) {
		this.server = server;
	}

	dateAdd(date1, amount, units) {

		var dayjs1 = dayjs(date1);
		var dayjs2 = dayjs1.add(amount, units);

		return dayjs2.toDate();

	}
	/**
		Notify associated users of an upcoming due date

		typically this method is invoked at start event
		and is scheduled at requested time
		request is deleted on Task completion

	**/
	async notifyOfDueDate({ item, daysBefore, message= `Item is due` }) {
		const to = [item.assignee, item.candidateUsers, item.candidateGroups];

		return await this.notify({ to, template: 'default', item, message });
	}
	/**
		Notify Assigned User of the assignment

		typically this method is invoked at assign event

	**/

	async notifyAssigned({ item, message='New Task Assigned'}){
		const to = [item.assignee];
		return await this.notify({ to, template: 'default', item, message });

    }
	async notify( {to, template, item, message} ) {

		const users=await this.getUsers(to);

		if (!template)
			template = 'default';

        users.forEach(user => {
                const path = this.server.configuration.templatesPath + '/' + template;
                const msg = pug.renderFile(path + '.message.pug', { item, user,email:user.email, message });
                const body = pug.renderFile(path + '.body.pug', { item, user,email:user.email, message  })
                console.log("email to",user.userName,user.email,msg, msg,body);
                
                this.server.appDelegate.sendEmail(user.email, msg, body);
            
        });

	}
	async getUsers(toList){
		let  users=[];
		for(let t=0;t<toList.length;t++)
		{
			const to=toList[t];
			if (to.user)
			{
				to.user.forEach(u=>{users.push(u);});
			}
			else if (to.group) {
				for(let g=0;g<to.group.length;g++)
				{	
					const grp=to.group[g];
					const grpUsers=await this.getUserNamesInGroup(grp);
					grpUsers.forEach(gu=>{users.push(gu)});
				}
			}
			
		}
		
		let unique = [...new Set(users)];
		const usersInfo=await this.getUsersInfo(unique);
		
		return usersInfo;
		
	}
	async getUserNamesInGroup(group) {
		const list=[];
		const users=await this.server.userService.findUsers({userGroups:group});
		//console.log('users in group',group,users);
		users.forEach(user=>{list.push(user.userName)});
		return list; 
		
	}
	async getUsersInfo(users) {
		const usersInfo=[];
		for(let i=0;i<users.length;i++)
		{
			const userName=users[i];
			const user=await this.server.userService.findUser({userName:userName});
			if (user)
				usersInfo.push({userName:userName,email:user.email});
		}
		return usersInfo;
	}
}
function sampleCall(appUtils,appServices,item) {

	appUtils.notify({
		to: [{
			user: ['user1', 'user2',
				appServices.getSupervisor(item.requestor),
				item.assignee]
			},
			{ group: ['group1', 'HR', item.candidateUserGroups] }]
		, on: appUtils.dateAdd(item.dueDate, -10, 'day') // 10 days before due date --NOT SUPPORTED THIS RELEASE
		, delay: 'P10D' 	// 10 days from now --NOT SUPPORTED THIS RELEASE
		, template: 'default',
		item
	});
	//	Brief Format:

	appUtils.notifyDueDate({ item, daysBefore: 10 });
	appUtils.notifyAssigned({ item,message:`New Task Assigned`});
	// this will notify assigned user 
	//	if User is not assigned, will notify all candidate


} 

export {AppUtils}

	
	
