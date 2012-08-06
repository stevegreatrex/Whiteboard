using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Whiteboard.Models
{
	public class BoardViewModel
	{
		public BoardViewModel()
		{
			this.OpenBoards = new List<BoardStub>();
		}

		public Board Board { get; set; }
		public IList<BoardStub> OpenBoards { get; private set; }
	}
}