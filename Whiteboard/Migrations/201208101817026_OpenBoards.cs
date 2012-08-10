namespace Whiteboard.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class OpenBoards : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "OpenBoards",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        BoardId = c.Guid(nullable: false),
                        Username = c.String(nullable: false),
                        LastOpened = c.DateTime(nullable: false),
                        IsPinned = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("Boards", t => t.BoardId, cascadeDelete: true)
                .Index(t => t.BoardId);
            
        }
        
        public override void Down()
        {
            DropIndex("OpenBoards", new[] { "BoardId" });
            DropForeignKey("OpenBoards", "BoardId", "Boards");
            DropTable("OpenBoards");
        }
    }
}
