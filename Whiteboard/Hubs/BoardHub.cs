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

		/// <summary>
		/// Remove an artifact from it's board
		/// </summary>
		/// <param name="artifactId"></param>
		public void RemoveArtifact(Guid artifactId)
		{
			var artifact = _context.Artifacts.Find(artifactId);
			if (artifactId == null) throw new InvalidOperationException();

			_context.Artifacts.Remove(artifact);

			
			var artifactEvent = new BoardEvent { BoardId = artifact.BoardId, Description = "Removed Drawing Artifact" };
			if (this.Context.User != null)
				artifactEvent.User = this.Context.User.Identity.Name;

			_context.BoardEvents.Add(artifactEvent);

			_context.SaveChanges();

			Clients[artifactEvent.BoardId.ToString()].artifactRemoved(artifactId, artifactEvent);
		}

		/// <summary>
		/// Clears a board
		/// </summary>
		/// <param name="boardId"></param>
		public void ClearBoard(Guid boardId)
		{
			_context.Artifacts.Where(a => a.BoardId == boardId)
				.ToList().ForEach(a => _context.Artifacts.Remove(a));
			
			var clearedEvent = new BoardEvent { BoardId = boardId, Description = "Cleared Board" };
			if (this.Context.User != null)
				clearedEvent.User = this.Context.User.Identity.Name;
			_context.BoardEvents.Add(clearedEvent);

			_context.SaveChanges();

			Clients[boardId.ToString()].boardCleared(clearedEvent);
		}

		/// <summary>
		/// Add a new artifact to a board
		/// </summary>
		/// <param name="boardId"></param>
		/// <param name="artifact"></param>
		/// <returns></returns>
		public Artifact AddArtifact(Guid boardId, Artifact artifact)
		{
			if (artifact == null) throw new ArgumentNullException("artifact");

			var board = _context.Boards.Find(boardId);
			if (board == null) throw new InvalidOperationException();

			artifact.Id = Guid.NewGuid();
			artifact.Revision = _context.Artifacts.Where(a => a.BoardId == boardId).Select(a => a.Revision).OrderByDescending(r => r).FirstOrDefault() + 1;
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

		/// <summary>
		/// Rename a board
		/// </summary>
		/// <param name="boardId"></param>
		/// <param name="boardName"></param>
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

		/// <summary>
		/// Join a board
		/// </summary>
		/// <param name="boardId"></param>
		public void Join(Guid boardId)
		{
			Groups.Add(Context.ConnectionId, boardId.ToString());
		}
	}
}