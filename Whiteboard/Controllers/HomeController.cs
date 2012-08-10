using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Whiteboard.Models;

namespace Whiteboard.Controllers
{
	public class HomeController : Controller
	{
		private WhiteboardContext _context = new WhiteboardContext();

		public ActionResult Index()
		{
			var boards = Enumerable.Empty<Board>();

			if (Request.IsAuthenticated)
			{
				boards = _context.OpenBoards
					.Include("Board")
					.Where(b => b.Username == User.Identity.Name)
					.OrderByDescending(b => b.LastOpened)
					.Select(b => b.Board)
					.Take(10);
			}

			return View(boards);
		}
	}
}
