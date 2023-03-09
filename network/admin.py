from django.contrib import admin
from .models import User, Post, Like, Follow

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username" )

class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "content", "author", "datetime")

class LikeAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post")

class FollowAdmin(admin.ModelAdmin):
    list_display = ("id", "follower", "followed")

		
admin.site.register(User)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Follow)


