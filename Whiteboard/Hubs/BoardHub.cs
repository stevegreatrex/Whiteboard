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
			if (artifact == null) throw new InvalidOperationException();

			_context.Artifacts.Remove(artifact);

			
			var artifactEvent = new BoardEvent { BoardId = artifact.BoardId, Description = "Removed Drawing Artifact" };
			if (this.Context.User != null)
				artifactEvent.User = this.Context.User.Identity.Name;

			_context.BoardEvents.Add(artifactEvent);

			_context.SaveChanges();

			Clients[artifactEvent.BoardId.ToString()].artifactRemoved(artifactId, artifactEvent, Caller.callerId);
		}

		/// <summary>
		/// Clears a board
		/// </summary>
		/// <param name="boardId"></param>
		public void ClearBoard(Guid boardId)
		{
			_context.Artifacts.Where(a => a.BoardId == boardId)
				.ToList().ForEach(a => _context.Artifacts.Remove(a));

			var clearedEvent = new BoardEvent { BoardId = boardId, Description = "Board Cleared" };
			if (this.Context.User != null)
				clearedEvent.User = this.Context.User.Identity.Name;
			_context.BoardEvents.Add(clearedEvent);

			_context.SaveChanges();

			Clients[boardId.ToString()].boardCleared(clearedEvent, Caller.callerId);
		}

		/// <summary>
		/// Saves an existing artifact, or adds a new artifact to a board
		/// </summary>
		/// <param name="boardId"></param>
		/// <param name="artifact"></param>
		/// <returns></returns>
		public Artifact SaveArtifact(Guid boardId, Artifact artifact)
		{
			if (artifact == null) throw new ArgumentNullException("artifact");

			var isNew = artifact.Id == Guid.Empty;
			if (isNew) //if it's a new one
			{
				artifact.Id = Guid.NewGuid();
				artifact.BoardId = boardId;
				artifact.Revision = _context.Artifacts.Where(a => a.BoardId == boardId).Select(a => a.Revision).OrderByDescending(r => r).FirstOrDefault() + 1;
				_context.Artifacts.Add(artifact);
			}
			else
			{
				var toUpdate = _context.Artifacts.Find(artifact.Id);
				toUpdate.Data = artifact.Data;
			}

			var artifactEvent = new BoardEvent { BoardId = boardId, Description = "Drawing Updated" };
			if (this.Context.User != null)
				artifactEvent.User = this.Context.User.Identity.Name;
			_context.BoardEvents.Add(artifactEvent);
			
			_context.SaveChanges();

			if (isNew)
				Clients[boardId.ToString()].artifactAdded(artifact, artifactEvent, Caller.callerId);
			else
				Clients[boardId.ToString()].artifactUpdated(artifact, artifactEvent, Caller.callerId);
			
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

			Clients[boardId.ToString()].boardRenamed(boardName, renamedEvent, Caller.callerId);
		}

		/// <summary>
		/// Join a board
		/// </summary>
		/// <param name="boardId"></param>
		public void Join(Guid boardId, bool recordOpening)
		{
			Caller.callerId = Guid.NewGuid();
			Groups.Add(Context.ConnectionId, boardId.ToString());

			if (recordOpening && IsAuthenticated())
			{
				var openBoard = _context.OpenBoards
					.Where(ob => ob.BoardId == boardId && ob.Username == this.Context.User.Identity.Name)
					.FirstOrDefault();

				if (openBoard == null)
				{
					openBoard = new OpenBoard
					{
						Id = Guid.NewGuid(),
						BoardId = boardId,
						Username = this.Context.User.Identity.Name
					};

					_context.OpenBoards.Add(openBoard);
				}

				openBoard.LastOpened = DateTime.Now;
				_context.SaveChanges();
			}
		}

		private bool IsAuthenticated()
		{
			return this.Context.User != null && !string.IsNullOrEmpty(this.Context.User.Identity.Name);
		}
	}
}