from rest_framework import permissions

from django.conf import settings



class IsCreator(permissions.BasePermission):
    """
    Object-level permission to only allow creators of an object to edit it.
    """
    message = 'You must be the creator of this object.'

    def has_object_permission(self, request, view, obj):
        auth0_user_id = request.user
        return obj.owner == auth0_user_id or obj.managers.filter(username=auth0_user_id).exists()
