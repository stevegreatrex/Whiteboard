using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Whiteboard.Models
{
	public class BoardEvent
	{
		public BoardEvent()
		{
			this.Id = Guid.NewGuid();
			this.Date = DateTime.Now;
		}

		public Guid Id { get; set; }
		public DateTime Date { get; set; }
		public string Description { get; set; }
		public string User { get; set; }
		public Guid BoardId { get; set; }
	}
}