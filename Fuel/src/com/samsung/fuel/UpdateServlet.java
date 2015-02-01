package com.samsung.fuel;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Enumeration;

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
import com.google.gson.Gson;

@SuppressWarnings("serial")
public class UpdateServlet extends HttpServlet 
{	
	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException 
	{
		//Initializes variables
		//Receive data necessary for creating new entity object with same key
		String enType = "User";
		String accTok = req.getParameter("userID");

		//Get list of strings of passed parameterNames
		ArrayList<String> parameterNames = new ArrayList<String>();
		Enumeration enumeration = req.getParameterNames();
		while (enumeration.hasMoreElements()) {
			String parameterName = (String) enumeration.nextElement();
			parameterNames.add(parameterName);
		}

		Key k = KeyFactory.createKey(enType, accTok);

		//Update entity
		try{
			//Create new entity object from old to update
			Entity user = datastore.get(k);
			//Remove old
			datastore.delete(k);
			//Update all the passed parameters
			for(String parameter: parameterNames)
			{
				//If parameter is address
				//Convert address into lat and long
				//Update into the datastore
				if(parameter.equals("address"))
				{
					GoogleResponse res = new AddressConverter().convertToLatLong(req.getParameter(parameter));
					if(res.getStatus().equals("OK"))
					{
						for(Result result: res.getResults())
						{
							user.setProperty("lat",result.getGeometry().getLocation().getLat());
							user.setProperty("lng",result.getGeometry().getLocation().getLng());
						}
					}
				}
				
				//Set properties
				user.setProperty(parameter, req.getParameter(parameter));
			}
			//Enter into datastore
			datastore.put(user);
		}
		catch(EntityNotFoundException e){}

		//Returns json output of object
		Gson translate = new Gson();
		try {
			resp.getWriter().print(translate.toJson(datastore.get(k)));
		} catch (EntityNotFoundException e) {}
	}

	public void doGet(HttpServletRequest request,
			HttpServletResponse response) throws IOException,
			ServletException {
		doPost(request, response);
	}
}