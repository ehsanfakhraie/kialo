from rest_framework import viewsets, permissions

from .permissions import IsCreator
from .models import *
from . import serializers


class DiscussionViewset(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Discussion.objects.all()
    serializer_class = serializers.DiscussionSerializer
    http_method_names = ['get', 'put', 'patch', 'post']

    def perform_create(self, serializer):
        req = serializer.context['request']
        serializer.save(owner=req.user)
        c = Claim.created_discussion()
        c.save2()

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = Discussion.objects.all()
        owner = self.request.query_params.get('owner', None)
        if owner is not None:
            queryset = queryset.filter(owner=owner)
        return queryset

    def put(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)


class ClaimsViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    queryset = Claim.objects.all()
    serializer_class = serializers.ClaimSerializer

    def perform_create(self, serializer):
        req = serializer.context['request']
        serializer.save(owner=req.user)

    def get_queryset(self):
        queryset = Claim.objects.all()
        id = self.request.query_params.get('id', None)
        discussion = self.request.query_params.get('discussion', None)
        if id is not None:
            return queryset.filter(id=id)
        if discussion is not None:
            return queryset.filter(for_discussion=discussion, suggested=1)
        return queryset


class ClaimSgViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly
    ]
    # http_method_names = ['put']
    queryset = Claim.objects.all().filter(suggested=1)
    serializer_class = serializers.ClaimSerializer

    # def perform_create(self, serializer):
    #     req = serializer.context['request']
    #     serializer.save(owner=req.user,suggested=0)







class UserViewSet(viewsets.ModelViewSet):
    permissions_classes = [permissions.IsAuthenticatedOrReadOnly,
                           ]
    serializer_class = serializers.UserSerializer
    http_method_names = ['get']

    def get_queryset(self):
        username = self.request.query_params.get('username', None)
        if username is not None:
            return User.objects.all().filter(username=username)
        return User.objects.none()


class CommentViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
    ]
    queryset = Comment.objects.all()
    serializer_class = serializers.CommentSerializer

    def get_queryset(self):
        queryset = Comment.objects.all()
        claim = self.request.query_params.get('claim', None)
        if claim is not None:
            return Comment.objects.all().filter(for_claim=claim)
        return queryset

    def perform_create(self, serializer):
        req = serializer.context['request']
        serializer.save(owner=req.user)


class VoteViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
    ]
    queryset = Vote.objects.all()
    serializer_class = serializers.VoteSerializer

    def get_queryset(self):
        queryset = Vote.objects.all()
        claim = self.request.query_params.get('vote', None)
        if claim is not None:
            return Vote.objects.all().filter(for_claim=claim)
        return queryset

    def perform_create(self, serializer):
        req = serializer.context['request']
        serializer.save(owner=req.user)

    # def create(self, validated_data, **kwargs):
    #     print(validated_data.data)
    #     answer, created = Vote.objects.update_or_create(
    #         rate=validated_data.data['rate'],
    #         for_claim=validated_data.data['for_claim'])
    #     return answer


class DiscussionForUserViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    http_method_names = ['get']

    def get_queryset(self):
        queryset = User.objects.all().filter(id=self.request.user.id)
        return queryset

    # queryset = User.objects.all()
    serializer_class = serializers.DiscussionForUserSerializer
