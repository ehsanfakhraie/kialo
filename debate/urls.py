from django.urls import include, path
from rest_framework import routers

from debate import views
from kialoBack import settings
from django.conf.urls.static import static
from . import api

router = routers.DefaultRouter()
router.register(r'api/discussions', api.DiscussionViewset, 'discussions')
router.register(r'api/claims', api.ClaimsViewSet, 'claims')
router.register(r'api/comments', api.CommentViewSet, 'comments')
router.register(r'api/users', api.UserViewSet, 'users')
router.register(r'api/userDiscussions', api.DiscussionForUserViewSet, 'users')
router.register(r'api/votes', api.VoteViewSet, 'votes')
router.register(r'api/changeClaimSg', api.ClaimSgViewSet, 'Claimsg')

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('api/updateClaim/<int:pk>/', views.upClaim.as_view()),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
