using System.Data.Entity;

namespace Whiteboard.Models
{
	public class WhiteboardContext : DbContext
	{
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, add the following
        // code to the Application_Start method in your Global.asax file.
        // Note: this will destroy and re-create your database with every model change.
        // 
        // System.Data.Entity.Database.SetInitializer(new System.Data.Entity.DropCreateDatabaseIfModelChanges<Whiteboard.Models.WhiteboardContext>());

        public WhiteboardContext() : base("name=WhiteboardContext")
        {
        }

		public DbSet<Board> Boards { get; set; }

		public DbSet<BoardEvent> BoardEvents { get; set; }

		public DbSet<Artifact> Artifacts { get; set; }

		public DbSet<OpenBoard> OpenBoards { get; set; }
	}
}
