
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("add", views.add, name="add"),
    path("getposts/<str:page>", views.get_all_posts, name="get_all_posts"),
    path("getpostsprofile/<str:username>", views.get_all_posts_profile, name="get_all_posts_profile"),
    path("posts/<str:page>/<int:page_number>", views.load, name="load"),
    path("profile/<str:username>/<int:page_number>", views.load_profile, name="load_profile"),
    path("profile/<str:username>/follow", views.update_follow_status, name="update_follow_status"),
    path("profile/<str:username>/getstatus", views.get_follow_status, name="get_follow_status"),
    path("profile/<str:username>/getprofiledata", views.get_profile_data, name="get_profile_data"),
    path("getlikestatus/<int:post_id>", views.get_like_status, name="get_like_status"),
    path("updatelike/<int:post_id>", views.update_like, name="update_like"),
    path("saveedit/<int:post_id>", views.save_edit, name="save_edit")
]
