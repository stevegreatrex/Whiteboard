﻿using System.Web;
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

			bundles.Add(new ScriptBundle("~/bundles/knockout").Include(
						"~/Scripts/knockout*",
						"~/Scripts/utils*"));

			bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
						"~/Scripts/modernizr-*"));

			bundles.Add(new StyleBundle("~/Content/css/bootstrap").Include(
				"~/Content/bootstrap*"));

			bundles.Add(new StyleBundle("~/Content/less").Include(
				"~/Content/less/*.less"));
			
		}
	}
}