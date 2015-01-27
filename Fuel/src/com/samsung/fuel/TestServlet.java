package com.samsung.fuel;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.repackaged.com.google.gson.Gson;


class tits{
	String name;
	String email;
}

@SuppressWarnings("serial")
public class TestServlet extends HttpServlet {
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		resp.setContentType("text/plain");
		resp.getWriter().println("Hello, world");
		tits b = new tits();
		
		
		Gson gson = new Gson();
		gson.toJson(b);
		resp.getWriter().println(gson.toJson(b));
		String name = req.getParameter("NAME");
		resp.getWriter().println(name);
	}
}
