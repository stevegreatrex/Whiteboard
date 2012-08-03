using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SignalR.Hubs;
using Whiteboard.Models;

namespace Whiteboard.Hubs
{
	public class BoardHub : Hub
	{
		private WhiteboardContext _context = new WhiteboardContext();

		public void RenameBoard(Guid boardId, string boardName)
		{
			if (string.IsNullOrEmpty(boardName)) throw new InvalidOperationException();

			var board = _context.Boards.Find(boardId);
			if (board == null) throw new InvalidOperationException();

			var renamedEvent = new BoardEvent { BoardId = board.Id, Description = string.Format("Renamed from {0} to {1}", board.Name, boardName) };
			if (this.Context.User != null)
				renamedEvent.User = this.Context.User.Identity.Name;

			board.Name = boardName;
			board.BoardEvents.Add(renamedEvent);
			
			_context.SaveChanges();

			Clients.boardRenamed(boardId, boardName, renamedEvent);
		}
	}
}