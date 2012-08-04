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
				boards = _context.Boards
					.Where(b => b.CreatedByUser == User.Identity.Name)
					.OrderByDescending(b => b.BoardEvents.Max(be => be.Date))
					.Take(10);
			}

			return View(boards);
		}
	}
}
