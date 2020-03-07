from django.contrib.auth.models import User
from rest_framework import serializers, permissions
from rest_framework.fields import SerializerMethodField

from debate.models import Discussion, Claim, Comment, Vote


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username",
                  "id")


class ClaimSerializer(serializers.ModelSerializer):
    votes = serializers.SerializerMethodField()
    # suggested=serializers.IntegerField(source='get_sg',read_only=True)
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Claim

        fields = ["id",
                  "type",
                  "text",
                  "created_at",
                  "owner",
                  "parent",
                  "for_discussion",
                  "votes", 'suggested']

    def get_votes(self, instance):
        dict = {"1": len(Vote.objects.all().filter(rate=1, for_claim=instance.id)),
                "2": len(Vote.objects.all().filter(rate=2, for_claim=instance.id)),
                "3": len(Vote.objects.all().filter(rate=3, for_claim=instance.id)),
                "4": len(Vote.objects.all().filter(rate=4, for_claim=instance.id)),
                "5": len(Vote.objects.all().filter(rate=5, for_claim=instance.id))}
        return dict

class ClaimSerializer2(serializers.ModelSerializer):


    owner = UserSerializer(read_only=True)
    class Meta:
        model = Claim

        fields = ["id",
                  "type",
                  "text",
                  "created_at",
                  "owner",
                  "parent",
                  "for_discussion", 'suggested']





class DiscussionSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    managers = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    editors = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())
    writers = serializers.PrimaryKeyRelatedField(many=True, queryset=User.objects.all())

    claims = serializers.SerializerMethodField()

    class Meta:
        model = Discussion
        fields = ('id', 'title',
                  'text', 'photo', 'type', 'owner', 'managers', 'editors', 'writers', 'claims')

    def get_claims(self, instance):
        return ClaimSerializer(Claim.objects.all().filter(for_discussion=instance.id, suggested=0), many=True).data


class CommentSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ('__all__')


class VoteSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Vote
        fields = ('__all__')


class DiscussionForUserSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    manager = serializers.SerializerMethodField()
    editor = serializers.SerializerMethodField()
    writer = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("username", "id", 'owner', 'manager', 'editor', 'writer')

    def get_owner(self, instance):
        return Discussion.objects.all().filter(owner=instance).values_list('id', flat=True)

    def get_manager(self, instance):
        return Discussion.objects.all().filter(managers=instance.id).values_list('id', flat=True)

    def get_editor(self, instance):
        return Discussion.objects.all().filter(editors=instance.id).values_list('id', flat=True)

    def get_writer(self, instance):
        return Discussion.objects.all().filter(writers=instance.id).values_list('id', flat=True)
