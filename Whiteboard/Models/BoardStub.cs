using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace Whiteboard.Models
{
	public class BoardStub
	{
		[Required]
		public Guid Id { get; set; }
		public string Name { get; set; }
	}
}