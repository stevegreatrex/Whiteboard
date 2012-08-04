using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using SignalR.Hubs;
using Whiteboard.Models;

namespace Whiteboard.Hubs
{
	public class BoardHub : Hub
	{
		private WhiteboardContext _context = new WhiteboardContext();

		public Artifact AddArtifact(Guid boardId, Artifact artifact)
		{
			if (artifact == null) throw new ArgumentNullException("artifact");

			var board = _context.Boards.Find(boardId);
			if (board == null) throw new InvalidOperationException();

			artifact.Id = Guid.NewGuid();
			artifact.Revision = 0;
			artifact.BoardId = boardId;

			var artifactEvent = new BoardEvent { BoardId = board.Id, Description = "Drawing Updated" };
			if (this.Context.User != null)
				artifactEvent.User = this.Context.User.Identity.Name;

			board.Artifacts.Add(artifact);
			board.BoardEvents.Add(artifactEvent);

			_context.SaveChanges();

			Clients[boardId.ToString()].artifactAdded(artifact, artifactEvent);
			
			return artifact;
		}

		public void RenameBoard(Guid boardId, string boardName)
		{
			if (string.IsNullOrEmpty(boardName)) throw new InvalidOperationException();

			var board = _context.Boards.Find(boardId);
			if (board == null) throw new InvalidOperationException();

			if (board.Name == boardName) return;

			var renamedEvent = new BoardEvent { BoardId = board.Id, Description = string.Format("Renamed from {0} to {1}", board.Name, boardName) };
			if (this.Context.User != null)
				renamedEvent.User = this.Context.User.Identity.Name;

			board.Name = boardName;
			board.BoardEvents.Add(renamedEvent);
			
			_context.SaveChanges();

			Clients[boardId.ToString()].boardRenamed(boardName, renamedEvent);
		}

		public void Join(Guid boardId)
		{
			Groups.Add(Context.ConnectionId, boardId.ToString());
		}
	}
}