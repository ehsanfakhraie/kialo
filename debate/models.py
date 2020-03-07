from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class Discussion(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    title = models.TextField()
    type = models.IntegerField(default=0)
    photo = models.ImageField(default='debateDF.jpg', upload_to="debatesImgs/")
    managers = models.ManyToManyField(User, related_name='manager', blank=True)
    editors = models.ManyToManyField(User, related_name='editor', blank=True)
    writers = models.ManyToManyField(User, related_name='writer', blank=True)


class Claim(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    type = models.CharField(max_length=400)
    text = models.TextField(default='')
    parent = models.ForeignKey("Claim", on_delete=models.CASCADE, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    for_discussion = models.ForeignKey(Discussion, on_delete=models.CASCADE)

    suggested = models.IntegerField(default=0)

    @classmethod
    def created_discussion(cls):
        Discussion.objects.last()
        claim = cls(for_discussion=Discussion.objects.last(), type=0, owner=Discussion.objects.last().owner,
                    parent=None,
                    text=Discussion.objects.last().title)
        # do something with the book
        return claim


    def save(self, *args, **kwargs):
        if self.owner==self.for_discussion.owner:
            self.suggested=0
        else:
            self.suggested= not self.owner in self.for_discussion.managers.all() or self.owner in self.for_discussion.editors.all() or self.owner in self.for_discussion.writers.all()
        super(Claim, self).save(*args, **kwargs)
    def save2(self, *args, **kwargs):
        self.suggested =0
        super(Claim, self).save(*args, **kwargs)


class Comment(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    for_claim = models.ForeignKey(Claim, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Vote(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    for_claim = models.ForeignKey(Claim, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    rate = models.IntegerField()
