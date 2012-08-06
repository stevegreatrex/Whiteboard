using System.Web;
using System.Web.Optimization;

namespace Whiteboard
{
	public class BundleConfig
	{
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
						"~/Scripts/jquery-1.*"));

			bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
						"~/Scripts/bootstrap*"));

			bundles.Add(new ScriptBundle("~/bundles/moment").Include(
						"~/Scripts/moment*"));

			bundles.Add(new ScriptBundle("~/bundles/kinetic").Include(
						"~/Scripts/kinetic*"));

			bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
						"~/Scripts/knockout*"));

			bundles.Add(new ScriptBundle("~/bundles/viewmodels").Include(
						"~/Scripts/api.js",
						"~/Scripts/utils*",
						"~/Scripts/jQuery.pasteImageReader*",
						"~/Scripts/ViewModels/*.js",
						"~/Scripts/CanvasTools/GlobalSettings.js",
						"~/Scripts/CanvasTools/*.js"));

			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new ScriptBundle("~/bundles/signalr").Include(
						"~/Scripts/jQuery.signalR*"));

			bundles.Add(new StyleBundle("~/Content/bootstrap").Include(
				"~/Content/bootstrap.css",
				"~/Content/bootstrap-responsive.css"));

			bundles.Add(new StyleBundle("~/Content/less/dot.less").Include(
				"~/Content/less/*.less"));
			
		}
	}
}