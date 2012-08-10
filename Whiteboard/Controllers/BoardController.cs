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

			var board = _context.Boards.Where(b => b.Id == id).FirstOrDefault();
			if (board == null)
				return HttpNotFound();

			board.Artifacts = _context.Artifacts
				.Where(a => a.BoardId == id)
				.OrderBy(a => a.Revision)
				.ToList();

			board.BoardEvents = _context.BoardEvents
				.Where(be => be.BoardId == id)
				.OrderByDescending(be => be.Date)
				.Take(5)
				.ToList();

			var viewModel = new BoardViewModel();
			viewModel.Board = board;

			if (Request.IsAuthenticated)
			{
				var openBoards = _context.OpenBoards
					.Include("Board")
					.Where(b => b.Username == User.Identity.Name)
					.Where(b => b.BoardId != id.Value)
					.OrderByDescending(b => b.LastOpened)
					.Select(b => b.Board)
					.Take(10);

				foreach (var openBoard in openBoards)
				{
					viewModel.OpenBoards.Add(openBoard);					
				}
			}

			return View(viewModel);
        }

        //
        // GET: /Board/Create

        public ActionResult Create()
        {
			var board = new Board();
			board.Id = Guid.NewGuid();
			var createdEvent = new BoardEvent { BoardId = board.Id, Description = "Created " + board.Name };
			board.BoardEvents.Add(createdEvent);
			if (Request.IsAuthenticated)
			{
				board.CreatedByUser = User.Identity.Name;
				createdEvent.User = User.Identity.Name;
			}
			_context.Boards.Add(board);
			_context.SaveChanges();
			return RedirectToAction("Detail", new { id = board.Id });
        }

        protected override void Dispose(bool disposing)
        {
            _context.Dispose();
            base.Dispose(disposing);
        }
    }
}