package com.samsung.fuel;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.repackaged.com.google.gson.Gson;


@SuppressWarnings("serial")
public class LoginServlet extends HttpServlet 
{	
	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException 
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

		//Initializes variables and recieves data from the request
		String enType = "User";
		String accTok = req.getParameter("accTok");
		String userID = req.getParameter("userID");
		String name = req.getParameter("name");
		String email = req.getParameter("email");
		String address = null, co2= null, travelType= null, route = null;
		boolean isCarpool = false;

		//Create key for entity object using type of entity and accountToken
		Key k = KeyFactory.createKey(enType, accTok);
		
		//Check if entity already exists in database
		try{
			resp.getWriter().println("asdasdasdasd");
			datastore.get(k);
		}
		catch(EntityNotFoundException e)
		{
			//Insert new user and properties into database
			Entity user = new Entity(enType, accTok);
			user.setProperty("accTok", accTok);
			user.setProperty("userID", userID);
			user.setProperty("name", name);
			user.setProperty("email", email);
			user.setProperty("isCarpool", isCarpool);
			user.setProperty("address", address);
			user.setProperty("co2", co2);
			user.setProperty("travelType", travelType);
			user.setProperty("route", route);
			
			datastore.put(user);
			resp.getWriter().println("asdasdasdasd");
		}

		//Returns json output of object
		Gson translate = new Gson();
		try {
			resp.getWriter().println(translate.toJson(datastore.get(k)));
		} catch (EntityNotFoundException e) {
			resp.getWriter().println("sdsd");
		}
	}

	public void doGet(HttpServletRequest request,
			HttpServletResponse response) throws IOException,
			ServletException {
		doPost(request, response);
	}
}