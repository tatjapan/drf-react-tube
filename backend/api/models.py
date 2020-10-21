import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

# フロントエンドから指定されたパスへ動画とサムネイルをアップ
def load_path_video(instance, filename):
    return '/'.join(['video', str(instance.title)+str(".mp4")])

def load_path_thum(instance, filename):
    ext = filename.split('.')[-1] # 拡張子を元ファイルと同じにするため
    return '/'.join(['thum', str(instance.title)+str(".").str(ext)])

# ユーザー名＆PWでログイン→メアド＆PWへ変更する
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('You must enter your email address.')

        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    """ユーザー"""
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    email = models.EmailField(max_length=100, unique=True)
    username = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email


class Video(models.Model):
    """動画"""
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    title = models.CharField(max_length=50, blank=False)
    video = models.FileField(blank=False, upload_to=load_path_video)
    thum = models.ImageField(blank=False, upload_to=load_path_thum)
    like = models.IntegerField(default=0)
    dislike = models.IntegerField(default=0)

    def __str__(self):
        return self.title
