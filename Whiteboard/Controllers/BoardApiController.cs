using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using Whiteboard.Models;

namespace Whiteboard.Controllers
{
    public class BoardApiController : ApiController
    {
		private readonly WhiteboardContext _context = new WhiteboardContext();

		public void SetBoardName([FromUri]Guid boardId, [FromUri]string boardName)
		{
			if (string.IsNullOrEmpty(boardName)) throw new InvalidOperationException();

			var board = _context.Boards.Find(boardId);
			if (board == null) throw new InvalidOperationException();

			board.Name = boardName;
			_context.SaveChanges();
		}
    }
}
