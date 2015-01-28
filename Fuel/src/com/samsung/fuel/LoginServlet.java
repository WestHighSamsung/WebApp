package com.samsung.conserve;
import java.io.IOException;

import javax.servlet.http.*;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;
import java.util.Date;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet 
{	
	//I THINK WE NEED TO PASS IN A DATASTORE OBJECT
	
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException 
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		//UserService userService = UserServiceFactory.getUserService();
		//User user = userService.getCurrentUser();

		//Initializes variables and recieves data from the request
		String enType = "User";
		String accTok = req.getParameter("guestbookName");
		String userID = req.getParameter("guestbookName");
		String address = null, name= null, email= null, co2= null, 
				travelType= null, route = null;
		boolean isCarpool = false;
		
		//Create a key to store the datapoint
		Key accTokKey = KeyFactory.createKey(enType, accTok);
		
		//Check if user data exists
		try
		{
			datastore.get(accTokKey);
		}catch(EntityNotFoundException e)
		{
			//Create new user
			Entity user = new Entity(enType, accTokKey);
			user.setProperty("userID", userID);
			user.setProperty("address", null);
			user.setProperty("name", null);
			user.setProperty("email", null);
			user.setProperty("co2", null);
			user.setProperty("travelType", null);
			user.setProperty("route", null);
			user.setProperty("isCarpool", isCarpool);
			
			datastore.put(user);
		}

		resp.sendRedirect("index.html/update");

	}
}