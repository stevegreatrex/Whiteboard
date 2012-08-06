using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Whiteboard.Models
{
	public class Board : BoardStub
	{
		public Board()
		{
			this.BoardEvents = new List<BoardEvent>();
			this.Artifacts = new List<Artifact>();
		}
		
		public string CreatedByUser { get; set; }

		public ICollection<BoardEvent> BoardEvents { get; set; }

		public ICollection<Artifact> Artifacts { get; set; }
	}
}