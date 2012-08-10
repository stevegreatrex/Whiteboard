using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Whiteboard.Models
{
	public class OpenBoard
	{
		public Guid Id { get; set; }

		[Required]
		public Guid BoardId { get; set; }

		[Required]
		public string Username { get; set; }

		public DateTime LastOpened { get; set; }

		public bool IsPinned { get; set; }

		public Board Board { get; set; }
	}
}