using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Whiteboard.Models
{
	public class Artifact
	{
		public Artifact()
		{
			this.Id = Guid.NewGuid();
		}

		public Guid Id { get; set; }
		public Guid BoardId { get; set; }
		public long Revision { get; set; }
		public string Type { get; set; }
		public string Data { get; set; }
	}
}