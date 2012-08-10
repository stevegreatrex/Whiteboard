namespace Whiteboard.Migrations
{
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "Boards",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        CreatedByUser = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "BoardEvents",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Date = c.DateTime(nullable: false),
                        Description = c.String(),
                        User = c.String(),
                        BoardId = c.Guid(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("Boards", t => t.BoardId, cascadeDelete: true)
                .Index(t => t.BoardId);
            
            CreateTable(
                "Artifacts",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        BoardId = c.Guid(nullable: false),
                        Revision = c.Long(nullable: false),
                        Type = c.String(),
                        Data = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("Boards", t => t.BoardId, cascadeDelete: true)
                .Index(t => t.BoardId);
            
        }
        
        public override void Down()
        {
            DropIndex("Artifacts", new[] { "BoardId" });
            DropIndex("BoardEvents", new[] { "BoardId" });
            DropForeignKey("Artifacts", "BoardId", "Boards");
            DropForeignKey("BoardEvents", "BoardId", "Boards");
            DropTable("Artifacts");
            DropTable("BoardEvents");
            DropTable("Boards");
        }
    }
}
