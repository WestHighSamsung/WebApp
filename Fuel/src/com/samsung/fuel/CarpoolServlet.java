package com.samsung.fuel;
import java.io.IOException;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.gson.Gson;


@SuppressWarnings("serial")
public class CarpoolServlet extends HttpServlet 
{	
	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

	@Override
	public void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws IOException 
	{
		
		
		//Initializes variables and recieves data from the request
		String enType = "User";
		String accTok = req.getParameter("userID");
		//String userID = req.getParameter("userID");
		
		//Create key for entity object using type of entity and accountToken
		Key k = KeyFactory.createKey(enType, accTok);
		double lat1 = 0, lng1 = 0;

		//Get the latitude and longitude of given user
		try {
			lat1 = Float.parseFloat((String) datastore.get(k).getProperty("lat"));
			lng1 = Float.parseFloat((String) datastore.get(k).getProperty("lng"));
		} catch (NumberFormatException | EntityNotFoundException e1) {}
		
		//Query into database
		Query q = new Query(enType);
		List<Entity> userAddr = datastore.prepare(q).asList(FetchOptions.Builder.withDefaults());
		ArrayList<Neighbor> closeOthers = new ArrayList<Neighbor>();
		Gson sus = new Gson();
		
		//Cycle through database
		for(Entity user: userAddr)
		{
			System.out.println("User get properties" +sus.toJson(user));
			if(user == null)
				continue;
			if(user.getProperty("userID").equals(accTok))
				continue;
			
			System.out.println(user.getProperty("lat"));
			double lat2 = Float.parseFloat((String) user.getProperty("lat"));
			double lng2 = Float.parseFloat((String) user.getProperty("lng"));
			//find distance between two given users
			double distance = Math.sqrt(Math.pow(lat2-lat1,2) + Math.pow(lng2-lng1, 2))*69.0;
			
			//Place in order into a new list
			if(closeOthers.size()==0)
				closeOthers.add(new Neighbor(user, distance));
			else
			{
				int index = 0;
				for(Neighbor a: closeOthers)
				{
					if(distance <= a.distance)
						break;
					index++;
				}
				closeOthers.add(index, new Neighbor(user, distance));
			}
		}
		for(Neighbor a: closeOthers)
		{
			System.out.println(a.given.getProperty("name"));
		}
		
		//Return closest 6 people in database as json objects
		//One of these 6 is the original, given user searching for close neighbors to carpool with
		Gson translate = new Gson();
		ArrayList<Neighbor> closest = new ArrayList<Neighbor>();
		for(int i= 0; i< (closeOthers.size() >= 5 ? 5 : closeOthers.size()); i++)
		{
			closest.add(closeOthers.get(i));
		}
		resp.getWriter().print(translate.toJson(closest));
	}

	public void doGet(HttpServletRequest request,
			HttpServletResponse response) throws IOException,
			ServletException {
		doPost(request, response);
	}
	
	public class Neighbor
	{
		public Entity given;
		public double distance;
		public String sdist;
		public Neighbor(Entity e, double dist)
		{
			given = e;
			distance = dist;

			
			DecimalFormat df = new DecimalFormat("##.##");
			sdist = df.format(distance);
		}
	}
}

