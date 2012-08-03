using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Whiteboard.Models;

namespace Whiteboard.Controllers
{
    public class BoardController : Controller
    {
        private WhiteboardContext _context = new WhiteboardContext();

        //
        // GET: /Board/

		public ActionResult Detail(Guid? id)
        {
			if (!id.HasValue) return RedirectToAction("Index", "Home");

			var board = _context.Boards.Find(id);
			if (board == null)
				return HttpNotFound();

			return View(board);
        }

        //
        // GET: /Board/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Board/Create

        [HttpPost]
        public ActionResult Create(Board board)
        {
            if (ModelState.IsValid)
            {
                board.Id = Guid.NewGuid();
				if (Request.IsAuthenticated)
					board.CreatedByUser = User.Identity.Name;
                _context.Boards.Add(board);
                _context.SaveChanges();
				return RedirectToAction("Detail", new { id = board.Id });
            }

            return View(board);
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
            base.Dispose(disposing);
        }
    }
}