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
				boards = _context.Boards.Where(b => b.CreatedByUser == User.Identity.Name);
			}

			return View(boards);
		}
	}
}
