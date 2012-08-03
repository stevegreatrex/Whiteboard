using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Whiteboard.Models
{
	public class Board
	{
		public Board()
		{
			this.BoardEvents = new List<BoardEvent>();
		}

		[Required]
		public Guid Id { get; set; }
		
		[Required(ErrorMessage = "What will you call this board?", AllowEmptyStrings=false)]
		public string Name { get; set; }

		public string CreatedByUser { get; set; }

		public ICollection<BoardEvent> BoardEvents { get; set; }
	}
}